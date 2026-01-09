import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from, throwError } from 'rxjs';
import { mergeMap, catchError, finalize } from 'rxjs/operators';
import { PrismaService } from 'src/infrastructure/prisma';
import {
  TRANSACTIONAL_KEY,
  TransactionalOptions,
  IsolationLevel,
  Propagation,
} from 'src/core/decorators/transactional.decorator';
import { Prisma } from '@prisma/client';
import { TransactionContextService } from 'src/core/transaction/transaction-context.service';
import { BusinessException } from 'src/shared/exceptions';
import { ResponseCode } from 'src/shared/response';

/**
 * Prisma 隔离级别映射
 */
const ISOLATION_LEVEL_MAP: Record<IsolationLevel, Prisma.TransactionIsolationLevel> = {
  [IsolationLevel.ReadUncommitted]: Prisma.TransactionIsolationLevel.ReadUncommitted,
  [IsolationLevel.ReadCommitted]: Prisma.TransactionIsolationLevel.ReadCommitted,
  [IsolationLevel.RepeatableRead]: Prisma.TransactionIsolationLevel.RepeatableRead,
  [IsolationLevel.Serializable]: Prisma.TransactionIsolationLevel.Serializable,
};

/**
 * 事务拦截器
 *
 * @description 拦截带有 @Transactional 装饰器的方法，自动包装在事务中执行
 *
 * 支持的传播行为：
 * - REQUIRED: 如果当前存在事务，则加入；否则创建新事务
 * - REQUIRES_NEW: 创建新事务，挂起当前事务
 * - SUPPORTS: 如果当前存在事务，则加入；否则非事务执行
 * - NOT_SUPPORTED: 非事务执行，挂起当前事务
 * - MANDATORY: 必须在事务中执行，否则抛出异常
 * - NEVER: 必须非事务执行，否则抛出异常
 */
@Injectable()
export class TransactionalInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransactionalInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly transactionContext: TransactionContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get<TransactionalOptions>(TRANSACTIONAL_KEY, context.getHandler());

    // 如果没有事务装饰器，直接执行
    if (!options) {
      return next.handle();
    }

    // 只读事务不需要包装
    if (options.readOnly) {
      return next.handle();
    }

    // 处理事务传播行为
    return this.handlePropagation(next, options);
  }

  /**
   * 处理事务传播行为
   */
  private handlePropagation(next: CallHandler, options: TransactionalOptions): Observable<any> {
    const propagation = options.propagation || Propagation.REQUIRED;
    const isInTransaction = this.transactionContext.isInTransaction();

    switch (propagation) {
      case Propagation.REQUIRED:
        // 如果当前存在事务，则加入；否则创建新事务
        if (isInTransaction) {
          this.logger.debug('REQUIRED: 加入现有事务');
          return next.handle();
        }
        this.logger.debug('REQUIRED: 创建新事务');
        return this.executeInNewTransaction(next, options);

      case Propagation.REQUIRES_NEW:
        // 创建新事务，挂起当前事务
        this.logger.debug('REQUIRES_NEW: 创建新事务，挂起当前事务');
        return this.executeInNewTransactionWithSuspend(next, options);

      case Propagation.SUPPORTS:
        // 如果当前存在事务，则加入；否则非事务执行
        if (isInTransaction) {
          this.logger.debug('SUPPORTS: 加入现有事务');
        } else {
          this.logger.debug('SUPPORTS: 非事务执行');
        }
        return next.handle();

      case Propagation.NOT_SUPPORTED:
        // 非事务执行，挂起当前事务
        if (isInTransaction) {
          this.logger.debug('NOT_SUPPORTED: 挂起当前事务，非事务执行');
          return this.executeWithSuspendedTransaction(next);
        }
        this.logger.debug('NOT_SUPPORTED: 非事务执行');
        return next.handle();

      case Propagation.MANDATORY:
        // 必须在事务中执行，否则抛出异常
        if (!isInTransaction) {
          this.logger.error('MANDATORY: 当前没有事务，抛出异常');
          return throwError(
            () =>
              new BusinessException(
                ResponseCode.BUSINESS_ERROR,
                'MANDATORY 传播行为要求必须在事务中执行，但当前没有活动事务',
              ),
          );
        }
        this.logger.debug('MANDATORY: 加入现有事务');
        return next.handle();

      case Propagation.NEVER:
        // 必须非事务执行，否则抛出异常
        if (isInTransaction) {
          this.logger.error('NEVER: 当前存在事务，抛出异常');
          return throwError(
            () =>
              new BusinessException(
                ResponseCode.BUSINESS_ERROR,
                'NEVER 传播行为要求必须非事务执行，但当前存在活动事务',
              ),
          );
        }
        this.logger.debug('NEVER: 非事务执行');
        return next.handle();

      default:
        return this.executeInNewTransaction(next, options);
    }
  }

  /**
   * 在新事务中执行
   */
  private executeInNewTransaction(next: CallHandler, options: TransactionalOptions): Observable<any> {
    return from(
      this.prisma.$transaction(
        async (tx) => {
          // 设置事务上下文
          this.transactionContext.setTransaction(tx as any, false);

          return new Promise((resolve, reject) => {
            next.handle().subscribe({
              next: (value) => resolve(value),
              error: (err) => {
                // 检查是否需要回滚
                if (this.shouldRollback(err, options)) {
                  reject(err);
                } else {
                  resolve(err);
                }
              },
              complete: () => {},
            });
          });
        },
        {
          isolationLevel: ISOLATION_LEVEL_MAP[options.isolationLevel || IsolationLevel.ReadCommitted],
          timeout: options.timeout,
        },
      ),
    ).pipe(
      mergeMap((result) => {
        if (result instanceof Error) {
          throw result;
        }
        return [result];
      }),
      finalize(() => {
        // 清除事务上下文
        this.transactionContext.clearTransaction();
      }),
    );
  }

  /**
   * 在新事务中执行，并挂起当前事务（REQUIRES_NEW）
   */
  private executeInNewTransactionWithSuspend(next: CallHandler, options: TransactionalOptions): Observable<any> {
    // 挂起当前事务
    const suspendedTransaction = this.transactionContext.suspendTransaction();

    return from(
      this.prisma.$transaction(
        async (tx) => {
          // 设置新的事务上下文
          this.transactionContext.setTransaction(tx as any, true);

          return new Promise((resolve, reject) => {
            next.handle().subscribe({
              next: (value) => resolve(value),
              error: (err) => {
                if (this.shouldRollback(err, options)) {
                  reject(err);
                } else {
                  resolve(err);
                }
              },
              complete: () => {},
            });
          });
        },
        {
          isolationLevel: ISOLATION_LEVEL_MAP[options.isolationLevel || IsolationLevel.ReadCommitted],
          timeout: options.timeout,
        },
      ),
    ).pipe(
      mergeMap((result) => {
        if (result instanceof Error) {
          throw result;
        }
        return [result];
      }),
      finalize(() => {
        // 清除当前事务上下文
        this.transactionContext.clearTransaction();
        // 恢复被挂起的事务
        if (suspendedTransaction) {
          this.transactionContext.resumeTransaction();
        }
      }),
    );
  }

  /**
   * 挂起当前事务后执行（NOT_SUPPORTED）
   */
  private executeWithSuspendedTransaction(next: CallHandler): Observable<any> {
    // 挂起当前事务
    const suspendedTransaction = this.transactionContext.suspendTransaction();

    return next.handle().pipe(
      finalize(() => {
        // 恢复被挂起的事务
        if (suspendedTransaction) {
          this.transactionContext.resumeTransaction();
        }
      }),
    );
  }

  /**
   * 判断是否需要回滚
   */
  private shouldRollback(error: Error, options: TransactionalOptions): boolean {
    // 检查 noRollbackFor
    if (options.noRollbackFor?.length) {
      for (const ExceptionType of options.noRollbackFor) {
        if (error instanceof ExceptionType) {
          return false;
        }
      }
    }

    // 检查 rollbackFor
    if (options.rollbackFor?.length) {
      for (const ExceptionType of options.rollbackFor) {
        if (error instanceof ExceptionType) {
          return true;
        }
      }
      // 如果指定了 rollbackFor，但错误不在列表中，不回滚
      return false;
    }

    // 默认所有异常都回滚
    return true;
  }
}

# Design Document: 企业级事务管理

## Overview

本设计文档描述企业级事务管理的实现方案，基于 NestJS + Prisma 技术栈，通过 AsyncLocalStorage 实现事务上下文传递，支持完整的事务传播行为、嵌套事务、事务事件监听等企业级特性。

## Architecture

### 整体架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Application Layer                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    @Transactional Decorator                  │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │    │
│  │  │ propagation │  │ isolation   │  │  timeout    │          │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                 TransactionalInterceptor                     │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │              TransactionManager                      │    │    │
│  │  │  ┌───────────┐  ┌───────────┐  ┌───────────┐        │    │    │
│  │  │  │  Context  │  │Propagation│  │  Events   │        │    │    │
│  │  │  │  Storage  │  │  Handler  │  │  Emitter  │        │    │    │
│  │  │  └───────────┘  └───────────┘  └───────────┘        │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Infrastructure Layer                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │    │
│  │  │   Prisma    │  │AsyncLocal   │  │ Prometheus  │          │    │
│  │  │Transaction  │  │  Storage    │  │  Metrics    │          │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 事务上下文传递流程

```
┌──────────────────────────────────────────────────────────────────┐
│                    Request Processing Flow                        │
│                                                                   │
│  Request ──▶ Controller ──▶ ServiceA ──▶ ServiceB ──▶ Response   │
│                  │              │            │                    │
│                  ▼              ▼            ▼                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              AsyncLocalStorage (Transaction Context)         │ │
│  │  ┌─────────────────────────────────────────────────────┐    │ │
│  │  │  txId: "tx-123"                                      │    │ │
│  │  │  prismaClient: PrismaClient (in transaction)         │    │ │
│  │  │  startTime: 1704067200000                             │    │ │
│  │  │  isolation: ReadCommitted                             │    │ │
│  │  │  propagation: REQUIRED                                │    │ │
│  │  │  rollbackOnly: false                                  │    │ │
│  │  │  savepoints: []                                       │    │ │
│  │  └─────────────────────────────────────────────────────┘    │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. TransactionContext（事务上下文）

```typescript
// src/core/transaction/transaction-context.ts

import { AsyncLocalStorage } from 'async_hooks';
import { Prisma, PrismaClient } from '@prisma/client';

/**
 * 事务状态
 */
export enum TransactionStatus {
  ACTIVE = 'ACTIVE',
  COMMITTED = 'COMMITTED',
  ROLLED_BACK = 'ROLLED_BACK',
  SUSPENDED = 'SUSPENDED',
}

/**
 * 保存点信息
 */
export interface Savepoint {
  name: string;
  createdAt: number;
}

/**
 * 事务上下文数据
 */
export interface TransactionContextData {
  /** 事务ID */
  txId: string;
  /** Prisma 事务客户端 */
  prismaClient: Prisma.TransactionClient | null;
  /** 事务开始时间 */
  startTime: number;
  /** 隔离级别 */
  isolationLevel: Prisma.TransactionIsolationLevel;
  /** 传播行为 */
  propagation: Propagation;
  /** 超时时间（毫秒） */
  timeout: number;
  /** 是否只读 */
  readOnly: boolean;
  /** 是否标记为回滚 */
  rollbackOnly: boolean;
  /** 事务状态 */
  status: TransactionStatus;
  /** 保存点列表 */
  savepoints: Savepoint[];
  /** 父事务（用于嵌套事务） */
  parentContext: TransactionContextData | null;
  /** 挂起的事务（用于 REQUIRES_NEW） */
  suspendedContext: TransactionContextData | null;
}

/**
 * 事务上下文管理器
 */
export class TransactionContext {
  private static storage = new AsyncLocalStorage<TransactionContextData>();

  /**
   * 在事务上下文中执行
   */
  static run<T>(data: TransactionContextData, fn: () => T): T {
    return this.storage.run(data, fn);
  }

  /**
   * 获取当前事务上下文
   */
  static getCurrentContext(): TransactionContextData | undefined {
    return this.storage.getStore();
  }

  /**
   * 获取当前事务ID
   */
  static getTransactionId(): string | undefined {
    return this.storage.getStore()?.txId;
  }

  /**
   * 获取当前 Prisma 事务客户端
   */
  static getPrismaClient(): Prisma.TransactionClient | null {
    return this.storage.getStore()?.prismaClient ?? null;
  }

  /**
   * 检查是否在事务中
   */
  static isInTransaction(): boolean {
    const ctx = this.storage.getStore();
    return ctx !== undefined && ctx.status === TransactionStatus.ACTIVE;
  }

  /**
   * 标记当前事务为回滚
   */
  static setRollbackOnly(): void {
    const ctx = this.storage.getStore();
    if (ctx) {
      ctx.rollbackOnly = true;
    }
  }

  /**
   * 检查当前事务是否标记为回滚
   */
  static isRollbackOnly(): boolean {
    return this.storage.getStore()?.rollbackOnly ?? false;
  }

  /**
   * 生成事务ID
   */
  static generateTransactionId(): string {
    return `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
```

### 2. TransactionManager（事务管理器）

```typescript
// src/core/transaction/transaction-manager.ts

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MetricsService } from '@/observability/metrics';
import {
  TransactionContext,
  TransactionContextData,
  TransactionStatus,
} from './transaction-context';
import {
  Propagation,
  IsolationLevel,
  TransactionalOptions,
} from './transactional.decorator';
import {
  TransactionTimeoutException,
  ReadOnlyTransactionException,
  IllegalTransactionStateException,
} from './transaction.exceptions';

@Injectable()
export class TransactionManager {
  private readonly logger = new Logger(TransactionManager.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly metrics: MetricsService,
  ) {}

  /**
   * 执行事务
   */
  async execute<T>(
    options: TransactionalOptions,
    fn: () => Promise<T>,
  ): Promise<T> {
    const currentContext = TransactionContext.getCurrentContext();
    const propagation = options.propagation ?? Propagation.REQUIRED;

    // 根据传播行为处理
    switch (propagation) {
      case Propagation.REQUIRED:
        return this.handleRequired(options, fn, currentContext);

      case Propagation.REQUIRES_NEW:
        return this.handleRequiresNew(options, fn, currentContext);

      case Propagation.SUPPORTS:
        return this.handleSupports(options, fn, currentContext);

      case Propagation.NOT_SUPPORTED:
        return this.handleNotSupported(fn, currentContext);

      case Propagation.MANDATORY:
        return this.handleMandatory(options, fn, currentContext);

      case Propagation.NEVER:
        return this.handleNever(fn, currentContext);

      case Propagation.NESTED:
        return this.handleNested(options, fn, currentContext);

      default:
        return this.handleRequired(options, fn, currentContext);
    }
  }

  /**
   * REQUIRED: 如果当前存在事务，则加入；否则创建新事务
   */
  private async handleRequired<T>(
    options: TransactionalOptions,
    fn: () => Promise<T>,
    currentContext?: TransactionContextData,
  ): Promise<T> {
    if (currentContext && currentContext.status === TransactionStatus.ACTIVE) {
      // 加入现有事务
      this.logger.debug(`Joining existing transaction: ${currentContext.txId}`);
      return fn();
    }
    // 创建新事务
    return this.createNewTransaction(options, fn);
  }

  /**
   * REQUIRES_NEW: 挂起当前事务，创建新事务
   */
  private async handleRequiresNew<T>(
    options: TransactionalOptions,
    fn: () => Promise<T>,
    currentContext?: TransactionContextData,
  ): Promise<T> {
    if (currentContext && currentContext.status === TransactionStatus.ACTIVE) {
      // 挂起当前事务
      this.logger.debug(`Suspending transaction: ${currentContext.txId}`);
      currentContext.status = TransactionStatus.SUSPENDED;
    }

    try {
      // 创建新事务，记录被挂起的事务
      return await this.createNewTransaction(options, fn, currentContext);
    } finally {
      // 恢复被挂起的事务
      if (currentContext && currentContext.status === TransactionStatus.SUSPENDED) {
        currentContext.status = TransactionStatus.ACTIVE;
        this.logger.debug(`Resumed transaction: ${currentContext.txId}`);
      }
    }
  }

  /**
   * SUPPORTS: 如果当前存在事务，则加入；否则以非事务方式执行
   */
  private async handleSupports<T>(
    options: TransactionalOptions,
    fn: () => Promise<T>,
    currentContext?: TransactionContextData,
  ): Promise<T> {
    if (currentContext && currentContext.status === TransactionStatus.ACTIVE) {
      return fn();
    }
    // 非事务方式执行
    return fn();
  }

  /**
   * NOT_SUPPORTED: 挂起当前事务，以非事务方式执行
   */
  private async handleNotSupported<T>(
    fn: () => Promise<T>,
    currentContext?: TransactionContextData,
  ): Promise<T> {
    if (currentContext && currentContext.status === TransactionStatus.ACTIVE) {
      currentContext.status = TransactionStatus.SUSPENDED;
    }

    try {
      return await fn();
    } finally {
      if (currentContext && currentContext.status === TransactionStatus.SUSPENDED) {
        currentContext.status = TransactionStatus.ACTIVE;
      }
    }
  }

  /**
   * MANDATORY: 必须在事务中执行，否则抛出异常
   */
  private async handleMandatory<T>(
    options: TransactionalOptions,
    fn: () => Promise<T>,
    currentContext?: TransactionContextData,
  ): Promise<T> {
    if (!currentContext || currentContext.status !== TransactionStatus.ACTIVE) {
      throw new IllegalTransactionStateException(
        'No existing transaction found for MANDATORY propagation',
      );
    }
    return fn();
  }

  /**
   * NEVER: 必须以非事务方式执行，否则抛出异常
   */
  private async handleNever<T>(
    fn: () => Promise<T>,
    currentContext?: TransactionContextData,
  ): Promise<T> {
    if (currentContext && currentContext.status === TransactionStatus.ACTIVE) {
      throw new IllegalTransactionStateException(
        'Existing transaction found for NEVER propagation',
      );
    }
    return fn();
  }

  /**
   * NESTED: 创建嵌套事务（使用独立事务模拟）
   */
  private async handleNested<T>(
    options: TransactionalOptions,
    fn: () => Promise<T>,
    currentContext?: TransactionContextData,
  ): Promise<T> {
    if (!currentContext || currentContext.status !== TransactionStatus.ACTIVE) {
      // 没有外层事务，等同于 REQUIRED
      return this.createNewTransaction(options, fn);
    }

    // Prisma 不支持 savepoint，使用独立事务模拟
    this.logger.warn(
      'Prisma does not support savepoints. Using independent transaction for NESTED propagation.',
    );
    return this.createNewTransaction(options, fn, currentContext);
  }

  /**
   * 创建新事务
   */
  private async createNewTransaction<T>(
    options: TransactionalOptions,
    fn: () => Promise<T>,
    suspendedContext?: TransactionContextData,
  ): Promise<T> {
    const txId = TransactionContext.generateTransactionId();
    const startTime = Date.now();

    this.logger.debug(`Starting new transaction: ${txId}`);
    this.metrics.transactionStarted(txId);

    const isolationLevel = this.mapIsolationLevel(options.isolationLevel);

    try {
      const result = await this.prisma.$transaction(
        async (tx) => {
          const context: TransactionContextData = {
            txId,
            prismaClient: tx,
            startTime,
            isolationLevel,
            propagation: options.propagation ?? Propagation.REQUIRED,
            timeout: options.timeout ?? -1,
            readOnly: options.readOnly ?? false,
            rollbackOnly: false,
            status: TransactionStatus.ACTIVE,
            savepoints: [],
            parentContext: null,
            suspendedContext: suspendedContext ?? null,
          };

          return TransactionContext.run(context, async () => {
            // 设置超时
            const timeoutPromise = this.createTimeoutPromise(options.timeout, txId);

            try {
              const resultPromise = fn();
              const result = await Promise.race([resultPromise, timeoutPromise]);

              // 检查是否标记为回滚
              if (TransactionContext.isRollbackOnly()) {
                throw new Error('Transaction marked as rollback-only');
              }

              return result;
            } catch (error) {
              // 检查回滚规则
              if (this.shouldRollback(error, options)) {
                throw error;
              }
              return error as T;
            }
          });
        },
        {
          isolationLevel,
          timeout: options.timeout && options.timeout > 0 ? options.timeout : undefined,
        },
      );

      // 事务提交成功
      const duration = Date.now() - startTime;
      this.logger.debug(`Transaction committed: ${txId} (${duration}ms)`);
      this.metrics.transactionCommitted(txId, duration);

      // 发送事务提交事件
      this.eventEmitter.emit('transaction.committed', { txId, duration });

      return result;
    } catch (error) {
      // 事务回滚
      const duration = Date.now() - startTime;
      this.logger.warn(`Transaction rolled back: ${txId} (${duration}ms)`, error);
      this.metrics.transactionRolledBack(txId, duration);

      // 发送事务回滚事件
      this.eventEmitter.emit('transaction.rolledback', { txId, duration, error });

      throw error;
    } finally {
      // 发送事务完成事件
      this.eventEmitter.emit('transaction.completed', { txId });
    }
  }

  /**
   * 创建超时 Promise
   */
  private createTimeoutPromise(timeout: number | undefined, txId: string): Promise<never> {
    if (!timeout || timeout <= 0) {
      return new Promise(() => {}); // 永不 resolve
    }

    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new TransactionTimeoutException(`Transaction ${txId} timed out after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * 判断是否需要回滚
   */
  private shouldRollback(error: unknown, options: TransactionalOptions): boolean {
    if (!(error instanceof Error)) {
      return true;
    }

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
      return false;
    }

    // 默认所有 Error 都回滚
    return true;
  }

  /**
   * 映射隔离级别
   */
  private mapIsolationLevel(level?: IsolationLevel): Prisma.TransactionIsolationLevel {
    const map: Record<IsolationLevel, Prisma.TransactionIsolationLevel> = {
      [IsolationLevel.ReadUncommitted]: Prisma.TransactionIsolationLevel.ReadUncommitted,
      [IsolationLevel.ReadCommitted]: Prisma.TransactionIsolationLevel.ReadCommitted,
      [IsolationLevel.RepeatableRead]: Prisma.TransactionIsolationLevel.RepeatableRead,
      [IsolationLevel.Serializable]: Prisma.TransactionIsolationLevel.Serializable,
    };
    return map[level ?? IsolationLevel.ReadCommitted];
  }
}
```

### 3. TransactionalInterceptor（事务拦截器）

```typescript
// src/core/interceptors/transactional.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TransactionManager } from '../transaction/transaction-manager';
import { TRANSACTIONAL_KEY, TransactionalOptions } from '../decorators/transactional.decorator';

@Injectable()
export class TransactionalInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransactionalInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly transactionManager: TransactionManager,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get<TransactionalOptions>(
      TRANSACTIONAL_KEY,
      context.getHandler(),
    );

    // 如果没有事务装饰器，直接执行
    if (!options) {
      return next.handle();
    }

    // 使用事务管理器执行
    return from(
      this.transactionManager.execute(options, () => {
        return new Promise((resolve, reject) => {
          next.handle().subscribe({
            next: (value) => resolve(value),
            error: (err) => reject(err),
          });
        });
      }),
    ).pipe(
      mergeMap((result) => [result]),
    );
  }
}
```

### 4. TransactionService（编程式事务服务）

```typescript
// src/core/transaction/transaction.service.ts

import { Injectable } from '@nestjs/common';
import { TransactionManager } from './transaction-manager';
import { TransactionContext, TransactionContextData } from './transaction-context';
import { TransactionalOptions, Propagation, IsolationLevel } from './transactional.decorator';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionManager: TransactionManager) {}

  /**
   * 在事务中执行
   */
  async runInTransaction<T>(
    fn: () => Promise<T>,
    options?: Partial<TransactionalOptions>,
  ): Promise<T> {
    const mergedOptions: TransactionalOptions = {
      propagation: options?.propagation ?? Propagation.REQUIRED,
      isolationLevel: options?.isolationLevel ?? IsolationLevel.ReadCommitted,
      timeout: options?.timeout,
      readOnly: options?.readOnly ?? false,
      rollbackFor: options?.rollbackFor ?? [],
      noRollbackFor: options?.noRollbackFor ?? [],
    };

    return this.transactionManager.execute(mergedOptions, fn);
  }

  /**
   * 获取当前事务上下文
   */
  getCurrentTransaction(): TransactionContextData | undefined {
    return TransactionContext.getCurrentContext();
  }

  /**
   * 检查是否在事务中
   */
  isInTransaction(): boolean {
    return TransactionContext.isInTransaction();
  }

  /**
   * 获取当前事务ID
   */
  getTransactionId(): string | undefined {
    return TransactionContext.getTransactionId();
  }

  /**
   * 标记当前事务为回滚
   */
  setRollbackOnly(): void {
    TransactionContext.setRollbackOnly();
  }

  /**
   * 检查当前事务是否标记为回滚
   */
  isRollbackOnly(): boolean {
    return TransactionContext.isRollbackOnly();
  }

  /**
   * 获取当前 Prisma 事务客户端
   * 用于在事务中执行数据库操作
   */
  getPrismaClient() {
    return TransactionContext.getPrismaClient();
  }
}
```

### 5. TransactionalEventListener（事务事件监听器）

```typescript
// src/core/transaction/transactional-event-listener.decorator.ts

import { SetMetadata, applyDecorators } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export const TRANSACTIONAL_EVENT_LISTENER_KEY = 'TRANSACTIONAL_EVENT_LISTENER';

/**
 * 事务事件阶段
 */
export enum TransactionPhase {
  /** 事务提交后 */
  AFTER_COMMIT = 'AFTER_COMMIT',
  /** 事务回滚后 */
  AFTER_ROLLBACK = 'AFTER_ROLLBACK',
  /** 事务完成后（无论成功或失败） */
  AFTER_COMPLETION = 'AFTER_COMPLETION',
}

/**
 * 事务事件监听器选项
 */
export interface TransactionalEventListenerOptions {
  /** 事务阶段 */
  phase?: TransactionPhase;
  /** 事件名称 */
  event?: string;
}

/**
 * 事务事件监听器装饰器
 *
 * @example
 * ```typescript
 * @TransactionalEventListener({ phase: TransactionPhase.AFTER_COMMIT })
 * async handleUserCreated(event: UserCreatedEvent) {
 *   // 在事务提交后发送欢迎邮件
 *   await this.mailService.sendWelcomeEmail(event.userId);
 * }
 * ```
 */
export function TransactionalEventListener(
  options: TransactionalEventListenerOptions = {},
): MethodDecorator {
  const phase = options.phase ?? TransactionPhase.AFTER_COMMIT;
  const eventName = getEventName(phase, options.event);

  return applyDecorators(
    SetMetadata(TRANSACTIONAL_EVENT_LISTENER_KEY, { phase, event: options.event }),
    OnEvent(eventName),
  );
}

function getEventName(phase: TransactionPhase, customEvent?: string): string {
  if (customEvent) {
    return `transaction.${phase.toLowerCase()}.${customEvent}`;
  }

  switch (phase) {
    case TransactionPhase.AFTER_COMMIT:
      return 'transaction.committed';
    case TransactionPhase.AFTER_ROLLBACK:
      return 'transaction.rolledback';
    case TransactionPhase.AFTER_COMPLETION:
      return 'transaction.completed';
    default:
      return 'transaction.completed';
  }
}
```

### 6. Transaction Exceptions（事务异常）

```typescript
// src/core/transaction/transaction.exceptions.ts

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 事务超时异常
 */
export class TransactionTimeoutException extends HttpException {
  constructor(message: string = 'Transaction timed out') {
    super(message, HttpStatus.REQUEST_TIMEOUT);
  }
}

/**
 * 只读事务写操作异常
 */
export class ReadOnlyTransactionException extends HttpException {
  constructor(message: string = 'Cannot perform write operation in read-only transaction') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * 非法事务状态异常
 */
export class IllegalTransactionStateException extends HttpException {
  constructor(message: string = 'Illegal transaction state') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
```

### 7. TransactionModule（事务模块）

```typescript
// src/core/transaction/transaction.module.ts

import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TransactionManager } from './transaction-manager';
import { TransactionService } from './transaction.service';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [TransactionManager, TransactionService],
  exports: [TransactionManager, TransactionService],
})
export class TransactionModule {}
```

## Data Models

### 事务配置

```typescript
// src/config/transaction.config.ts

export interface TransactionConfig {
  /** 默认超时时间（毫秒），-1 表示无超时 */
  defaultTimeout: number;
  /** 默认隔离级别 */
  defaultIsolationLevel: IsolationLevel;
  /** 慢事务阈值（毫秒） */
  slowTransactionThreshold: number;
  /** 是否启用事务日志 */
  enableLogging: boolean;
  /** 是否启用事务指标 */
  enableMetrics: boolean;
}

// 默认配置
export const DEFAULT_TRANSACTION_CONFIG: TransactionConfig = {
  defaultTimeout: 30000, // 30秒
  defaultIsolationLevel: IsolationLevel.ReadCommitted,
  slowTransactionThreshold: 5000, // 5秒
  enableLogging: true,
  enableMetrics: true,
};
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: 事务上下文在异步调用链中正确传递

*For any* 带有 @Transactional 装饰器的方法执行期间，TransactionContext.getCurrentContext() 应该返回有效的事务上下文，包含 txId、startTime、isolationLevel、propagation 等必要字段。

**Validates: Requirements 1.1, 1.3**

### Property 2: 事务完成后上下文被清理

*For any* 事务（无论提交还是回滚），事务完成后 TransactionContext.isInTransaction() 应该返回 false。

**Validates: Requirements 1.4**

### Property 3: 传播行为正确性

*For any* 传播行为配置：
- REQUIRED：有事务时复用（txId 相同），无事务时创建新事务
- REQUIRES_NEW：总是创建新事务（txId 不同），原事务被挂起
- SUPPORTS：有事务时复用，无事务时非事务执行
- NOT_SUPPORTED：总是非事务执行，原事务被挂起
- MANDATORY：无事务时抛出 IllegalTransactionStateException
- NEVER：有事务时抛出 IllegalTransactionStateException
- NESTED：创建嵌套事务

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

### Property 4: 嵌套事务回滚隔离性

*For any* 嵌套事务场景：
- 嵌套事务回滚时，外层事务的数据变更应该保持不变
- 外层事务回滚时，所有嵌套事务的数据变更都应该回滚

**Validates: Requirements 3.2, 3.3**

### Property 5: 事务超时自动回滚

*For any* 配置了 timeout 的事务，如果执行时间超过 timeout，事务应该自动回滚并抛出 TransactionTimeoutException。

**Validates: Requirements 4.2**

### Property 6: 只读事务写操作拒绝

*For any* 配置了 readOnly: true 的事务，执行写操作（INSERT、UPDATE、DELETE）时应该抛出 ReadOnlyTransactionException。

**Validates: Requirements 5.3**

### Property 7: 回滚规则优先级

*For any* 异常和回滚规则配置：
- 如果异常匹配 noRollbackFor，不回滚
- 如果异常匹配 rollbackFor 但不匹配 noRollbackFor，回滚
- 如果异常同时匹配 rollbackFor 和 noRollbackFor，noRollbackFor 优先（不回滚）
- 如果未配置规则，所有 Error 类型异常都回滚

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 8: 事务事件触发时机

*For any* 事务事件监听器：
- AFTER_COMMIT 阶段的监听器只在事务成功提交后触发
- AFTER_ROLLBACK 阶段的监听器只在事务回滚后触发
- AFTER_COMPLETION 阶段的监听器在事务完成后触发（无论成功或失败）
- 事件处理器执行时 TransactionContext.isInTransaction() 应该返回 false

**Validates: Requirements 7.2, 7.3, 7.4, 7.5**

### Property 9: setRollbackOnly 标记生效

*For any* 在事务中调用 TransactionService.setRollbackOnly()，事务最终应该回滚而不是提交。

**Validates: Requirements 8.3**

### Property 10: 向后兼容性

*For any* 使用现有 @Transactional 装饰器的代码，在新实现下应该保持相同的行为：
- 相同的默认隔离级别（ReadCommitted）
- 相同的默认传播行为（REQUIRED）
- 相同的异常回滚行为

**Validates: Requirements 10.1, 10.3**

## Error Handling

### 异常类型

| 异常类型 | 触发条件 | HTTP 状态码 |
|---------|---------|------------|
| TransactionTimeoutException | 事务执行超时 | 408 Request Timeout |
| ReadOnlyTransactionException | 只读事务中执行写操作 | 400 Bad Request |
| IllegalTransactionStateException | 非法事务状态（如 MANDATORY 无事务） | 500 Internal Server Error |

### 异常处理策略

1. **事务异常**：自动回滚事务，记录日志，抛出异常
2. **业务异常**：根据 rollbackFor/noRollbackFor 配置决定是否回滚
3. **系统异常**：默认回滚事务，记录错误日志

## Testing Strategy

### 单元测试

1. **TransactionContext 测试**
   - 测试上下文存储和获取
   - 测试事务ID生成
   - 测试 rollbackOnly 标记

2. **TransactionManager 测试**
   - 测试各种传播行为
   - 测试超时处理
   - 测试回滚规则

3. **TransactionService 测试**
   - 测试编程式事务 API
   - 测试事务状态查询

### 属性测试

使用 fast-check 进行属性测试：

```typescript
// test/unit/core/transaction/transaction-manager.pbt.spec.ts
import * as fc from 'fast-check';

describe('TransactionManager - Property Tests', () => {
  describe('Property 3: 传播行为正确性', () => {
    /**
     * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**
     */
    it('REQUIRED propagation should join existing transaction or create new', () => {
      fc.assert(
        fc.asyncProperty(
          fc.boolean(), // hasExistingTransaction
          async (hasExistingTransaction) => {
            // 测试 REQUIRED 传播行为
            // ...
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 7: 回滚规则优先级', () => {
    /**
     * **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
     */
    it('noRollbackFor should take precedence over rollbackFor', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string()), // rollbackFor
          fc.array(fc.string()), // noRollbackFor
          fc.string(), // exceptionType
          (rollbackFor, noRollbackFor, exceptionType) => {
            // 测试回滚规则优先级
            // ...
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
```

### 集成测试

1. **数据库事务测试**
   - 测试事务提交后数据持久化
   - 测试事务回滚后数据恢复
   - 测试嵌套事务行为

2. **事件监听测试**
   - 测试 AFTER_COMMIT 事件触发
   - 测试 AFTER_ROLLBACK 事件触发
   - 测试事件处理器隔离性

## 迁移指南

### 从现有实现迁移

1. **无需修改现有代码**：新实现保持 API 兼容
2. **可选启用新特性**：
   - 事务事件监听：添加 @TransactionalEventListener
   - 编程式事务：注入 TransactionService
   - 嵌套事务：使用 Propagation.NESTED

### 配置变更

```typescript
// 新增配置项（可选）
export const transactionConfig = {
  defaultTimeout: 30000,
  slowTransactionThreshold: 5000,
  enableLogging: true,
  enableMetrics: true,
};
```


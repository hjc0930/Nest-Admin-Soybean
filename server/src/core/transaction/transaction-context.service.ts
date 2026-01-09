import { Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { PrismaClient } from '@prisma/client';

/**
 * 事务上下文数据
 */
export interface TransactionContextData {
  /** 事务客户端 */
  client: PrismaClient;
  /** 事务ID（用于日志追踪） */
  transactionId: string;
  /** 事务开始时间 */
  startTime: number;
  /** 是否为嵌套事务 */
  isNested: boolean;
  /** 父事务ID（如果是嵌套事务） */
  parentTransactionId?: string;
}

/**
 * CLS 存储键
 */
const TRANSACTION_CONTEXT_KEY = 'TRANSACTION_CONTEXT';
const TRANSACTION_STACK_KEY = 'TRANSACTION_STACK';

/**
 * 事务上下文服务
 *
 * 使用 CLS (Continuation-Local Storage) 在异步操作中传递事务上下文
 * 支持事务传播行为的实现
 */
@Injectable()
export class TransactionContextService {
  private readonly logger = new Logger(TransactionContextService.name);

  constructor(private readonly cls: ClsService) {}

  /**
   * 生成事务ID
   */
  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * 获取当前事务上下文
   */
  getCurrentTransaction(): TransactionContextData | undefined {
    return this.cls.get<TransactionContextData>(TRANSACTION_CONTEXT_KEY);
  }

  /**
   * 检查当前是否在事务中
   */
  isInTransaction(): boolean {
    return this.getCurrentTransaction() !== undefined;
  }

  /**
   * 获取当前事务客户端
   */
  getTransactionClient(): PrismaClient | undefined {
    return this.getCurrentTransaction()?.client;
  }

  /**
   * 设置事务上下文
   */
  setTransaction(client: PrismaClient, isNested = false): TransactionContextData {
    const currentTransaction = this.getCurrentTransaction();
    const transactionId = this.generateTransactionId();

    const contextData: TransactionContextData = {
      client,
      transactionId,
      startTime: Date.now(),
      isNested,
      parentTransactionId: currentTransaction?.transactionId,
    };

    this.cls.set(TRANSACTION_CONTEXT_KEY, contextData);
    this.logger.debug(`事务上下文已设置: ${transactionId}, 嵌套: ${isNested}`);

    return contextData;
  }

  /**
   * 清除事务上下文
   */
  clearTransaction(): void {
    const current = this.getCurrentTransaction();
    if (current) {
      this.logger.debug(`事务上下文已清除: ${current.transactionId}`);
    }
    this.cls.set(TRANSACTION_CONTEXT_KEY, undefined);
  }

  /**
   * 挂起当前事务（用于 REQUIRES_NEW 传播行为）
   * 返回被挂起的事务上下文，以便后续恢复
   */
  suspendTransaction(): TransactionContextData | undefined {
    const current = this.getCurrentTransaction();
    if (current) {
      // 将当前事务压入栈中
      const stack = this.getTransactionStack();
      stack.push(current);
      this.cls.set(TRANSACTION_STACK_KEY, stack);
      this.cls.set(TRANSACTION_CONTEXT_KEY, undefined);
      this.logger.debug(`事务已挂起: ${current.transactionId}`);
    }
    return current;
  }

  /**
   * 恢复被挂起的事务
   */
  resumeTransaction(): TransactionContextData | undefined {
    const stack = this.getTransactionStack();
    const suspended = stack.pop();
    if (suspended) {
      this.cls.set(TRANSACTION_STACK_KEY, stack);
      this.cls.set(TRANSACTION_CONTEXT_KEY, suspended);
      this.logger.debug(`事务已恢复: ${suspended.transactionId}`);
    }
    return suspended;
  }

  /**
   * 获取事务栈
   */
  private getTransactionStack(): TransactionContextData[] {
    return this.cls.get<TransactionContextData[]>(TRANSACTION_STACK_KEY) || [];
  }

  /**
   * 获取事务执行时间（毫秒）
   */
  getTransactionDuration(): number | undefined {
    const current = this.getCurrentTransaction();
    if (current) {
      return Date.now() - current.startTime;
    }
    return undefined;
  }

  /**
   * 获取当前事务ID
   */
  getTransactionId(): string | undefined {
    return this.getCurrentTransaction()?.transactionId;
  }
}

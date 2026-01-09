import { SetMetadata } from '@nestjs/common';

/**
 * 事务装饰器元数据键
 */
export const TRANSACTIONAL_KEY = 'TRANSACTIONAL';

/**
 * 事务隔离级别
 */
export enum IsolationLevel {
  ReadUncommitted = 'ReadUncommitted',
  ReadCommitted = 'ReadCommitted',
  RepeatableRead = 'RepeatableRead',
  Serializable = 'Serializable',
}

/**
 * 事务传播行为
 */
export enum Propagation {
  /** 如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务 */
  REQUIRED = 'REQUIRED',
  /** 创建一个新的事务，如果当前存在事务，则挂起当前事务 */
  REQUIRES_NEW = 'REQUIRES_NEW',
  /** 如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务方式执行 */
  SUPPORTS = 'SUPPORTS',
  /** 以非事务方式执行，如果当前存在事务，则挂起当前事务 */
  NOT_SUPPORTED = 'NOT_SUPPORTED',
  /** 如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常 */
  MANDATORY = 'MANDATORY',
  /** 以非事务方式执行，如果当前存在事务，则抛出异常 */
  NEVER = 'NEVER',
}

/**
 * 事务选项
 */
export interface TransactionalOptions {
  /** 隔离级别 */
  isolationLevel?: IsolationLevel;
  /** 传播行为 */
  propagation?: Propagation;
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 只读事务 */
  readOnly?: boolean;
  /** 回滚异常类型 */
  rollbackFor?: (new (...args: unknown[]) => Error)[];
  /** 不回滚异常类型 */
  noRollbackFor?: (new (...args: unknown[]) => Error)[];
}

/**
 * 事务装饰器
 *
 * @description 声明式事务管理，标记方法需要在事务中执行
 *
 * 支持的传播行为：
 * - REQUIRED: 如果当前存在事务，则加入；否则创建新事务（默认）
 * - REQUIRES_NEW: 创建新事务，挂起当前事务
 * - SUPPORTS: 如果当前存在事务，则加入；否则非事务执行
 * - NOT_SUPPORTED: 非事务执行，挂起当前事务
 * - MANDATORY: 必须在事务中执行，否则抛出异常
 * - NEVER: 必须非事务执行，否则抛出异常
 *
 * @example
 * ```typescript
 * // 基本用法 - 默认 REQUIRED 传播行为
 * @Transactional()
 * async createUserWithRoles(data: CreateUserDto) {
 *   const user = await this.userRepo.create(data);
 *   await this.roleRepo.bindRoles(user.id, data.roleIds);
 *   return user;
 * }
 *
 * // 使用 REQUIRES_NEW - 独立事务，不受外部事务影响
 * @Transactional({ propagation: Propagation.REQUIRES_NEW })
 * async logAuditEvent(event: AuditEvent) {
 *   // 即使外部事务回滚，审计日志也会保存
 *   await this.auditRepo.create(event);
 * }
 *
 * // 使用 MANDATORY - 必须在事务中调用
 * @Transactional({ propagation: Propagation.MANDATORY })
 * async updateBalance(userId: number, amount: number) {
 *   // 如果没有事务上下文，会抛出异常
 *   await this.balanceRepo.update(userId, amount);
 * }
 *
 * // 使用 Serializable 隔离级别
 * @Transactional({ isolationLevel: IsolationLevel.Serializable })
 * async transferMoney(from: number, to: number, amount: number) {
 *   // 需要串行化隔离级别的操作
 * }
 *
 * // 指定超时时间
 * @Transactional({ timeout: 5000 })
 * async longRunningOperation() {
 *   // 5秒超时
 * }
 * ```
 */
export function Transactional(options?: TransactionalOptions): MethodDecorator {
  return SetMetadata(TRANSACTIONAL_KEY, {
    isolationLevel: options?.isolationLevel ?? IsolationLevel.ReadCommitted,
    propagation: options?.propagation ?? Propagation.REQUIRED,
    timeout: options?.timeout,
    readOnly: options?.readOnly ?? false,
    rollbackFor: options?.rollbackFor ?? [],
    noRollbackFor: options?.noRollbackFor ?? [],
  });
}

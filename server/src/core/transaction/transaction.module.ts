import { Module, Global } from '@nestjs/common';
import { TransactionContextService } from './transaction-context.service';

/**
 * 事务模块
 *
 * 提供事务上下文管理功能，支持：
 * - 事务上下文的存储和获取
 * - 事务传播行为的实现
 * - 事务挂起和恢复
 */
@Global()
@Module({
  providers: [TransactionContextService],
  exports: [TransactionContextService],
})
export class TransactionModule {}

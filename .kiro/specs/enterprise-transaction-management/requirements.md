# Requirements Document

## Introduction

本文档定义了企业级事务管理功能的需求，旨在完善当前 @Transactional 装饰器的实现，支持完整的事务传播行为、嵌套事务、事务上下文传递等企业级特性，达到与 Spring @Transactional 相当的功能水平。

## Glossary

- **Transaction_Manager**: 事务管理器，负责事务的创建、提交、回滚
- **Propagation**: 事务传播行为，定义方法调用时事务如何传播
- **Isolation_Level**: 事务隔离级别，定义事务之间的隔离程度
- **CLS**: Continuation Local Storage，异步上下文存储，用于在异步调用链中传递事务上下文
- **Savepoint**: 保存点，用于实现嵌套事务的部分回滚
- **Transaction_Context**: 事务上下文，包含当前事务的状态和元数据
- **Interactive_Transaction**: Prisma 交互式事务，支持在事务中执行多个操作

## Requirements

### Requirement 1: 事务上下文传递

**User Story:** 作为开发者，我需要在异步调用链中自动传递事务上下文，以便嵌套的方法调用能够加入同一个事务。

#### Acceptance Criteria

1. THE Transaction_Manager SHALL 使用 AsyncLocalStorage 存储当前事务上下文
2. WHEN 一个带有 @Transactional 的方法调用另一个带有 @Transactional 的方法 THEN Transaction_Manager SHALL 根据传播行为决定是否复用事务
3. THE Transaction_Context SHALL 包含事务ID、开始时间、隔离级别、传播行为等元数据
4. WHEN 事务完成（提交或回滚）THEN Transaction_Manager SHALL 清理事务上下文

### Requirement 2: 完整的传播行为实现

**User Story:** 作为开发者，我需要完整的事务传播行为支持，以便在不同业务场景下灵活控制事务边界。

#### Acceptance Criteria

1. WHEN propagation 为 REQUIRED THEN Transaction_Manager SHALL 加入当前事务或创建新事务
2. WHEN propagation 为 REQUIRES_NEW THEN Transaction_Manager SHALL 挂起当前事务并创建新事务
3. WHEN propagation 为 SUPPORTS THEN Transaction_Manager SHALL 加入当前事务或以非事务方式执行
4. WHEN propagation 为 NOT_SUPPORTED THEN Transaction_Manager SHALL 挂起当前事务并以非事务方式执行
5. WHEN propagation 为 MANDATORY 且当前无事务 THEN Transaction_Manager SHALL 抛出异常
6. WHEN propagation 为 NEVER 且当前有事务 THEN Transaction_Manager SHALL 抛出异常
7. WHEN propagation 为 NESTED THEN Transaction_Manager SHALL 创建嵌套事务（使用 savepoint 模拟）

### Requirement 3: 嵌套事务支持

**User Story:** 作为开发者，我需要嵌套事务支持，以便在复杂业务场景下实现部分回滚。

#### Acceptance Criteria

1. THE Transaction_Manager SHALL 支持 NESTED 传播行为
2. WHEN 嵌套事务回滚 THEN Transaction_Manager SHALL 只回滚到 savepoint，不影响外层事务
3. WHEN 外层事务回滚 THEN Transaction_Manager SHALL 同时回滚所有嵌套事务
4. IF Prisma 不支持 savepoint THEN Transaction_Manager SHALL 使用独立事务模拟嵌套事务并记录警告

### Requirement 4: 事务超时控制

**User Story:** 作为开发者，我需要事务超时控制，以便防止长时间运行的事务占用资源。

#### Acceptance Criteria

1. THE @Transactional 装饰器 SHALL 支持 timeout 参数（毫秒）
2. WHEN 事务执行时间超过 timeout THEN Transaction_Manager SHALL 自动回滚事务并抛出 TransactionTimeoutException
3. THE Transaction_Manager SHALL 支持全局默认超时配置
4. WHEN timeout 为 -1 THEN Transaction_Manager SHALL 不设置超时限制

### Requirement 5: 只读事务优化

**User Story:** 作为开发者，我需要只读事务支持，以便优化查询性能。

#### Acceptance Criteria

1. THE @Transactional 装饰器 SHALL 支持 readOnly 参数
2. WHEN readOnly 为 true THEN Transaction_Manager SHALL 设置数据库连接为只读模式
3. WHEN readOnly 为 true 且执行写操作 THEN Transaction_Manager SHALL 抛出 ReadOnlyTransactionException
4. THE Transaction_Manager SHALL 对只读事务使用优化的隔离级别

### Requirement 6: 回滚规则配置

**User Story:** 作为开发者，我需要灵活配置回滚规则，以便精确控制哪些异常触发回滚。

#### Acceptance Criteria

1. THE @Transactional 装饰器 SHALL 支持 rollbackFor 参数指定需要回滚的异常类型
2. THE @Transactional 装饰器 SHALL 支持 noRollbackFor 参数指定不需要回滚的异常类型
3. WHEN 异常同时匹配 rollbackFor 和 noRollbackFor THEN noRollbackFor 优先级更高
4. WHEN 未配置回滚规则 THEN Transaction_Manager SHALL 对所有 Error 类型异常回滚

### Requirement 7: 事务事件监听

**User Story:** 作为开发者，我需要事务事件监听机制，以便在事务提交后执行后续操作。

#### Acceptance Criteria

1. THE Transaction_Manager SHALL 支持 @TransactionalEventListener 装饰器
2. WHEN phase 为 AFTER_COMMIT THEN 事件处理器 SHALL 在事务成功提交后执行
3. WHEN phase 为 AFTER_ROLLBACK THEN 事件处理器 SHALL 在事务回滚后执行
4. WHEN phase 为 AFTER_COMPLETION THEN 事件处理器 SHALL 在事务完成后执行（无论成功或失败）
5. THE 事件处理器 SHALL 在事务上下文之外执行，不影响原事务

### Requirement 8: 编程式事务支持

**User Story:** 作为开发者，我需要编程式事务 API，以便在复杂场景下手动控制事务边界。

#### Acceptance Criteria

1. THE TransactionService SHALL 提供 runInTransaction 方法执行事务
2. THE TransactionService SHALL 提供 getCurrentTransaction 方法获取当前事务
3. THE TransactionService SHALL 提供 setRollbackOnly 方法标记事务为回滚
4. THE TransactionService SHALL 提供 isRollbackOnly 方法检查事务是否标记为回滚
5. THE TransactionService SHALL 提供 createSavepoint 和 rollbackToSavepoint 方法

### Requirement 9: 事务监控和日志

**User Story:** 作为运维人员，我需要事务监控和日志，以便排查事务相关问题。

#### Acceptance Criteria

1. THE Transaction_Manager SHALL 记录事务开始、提交、回滚的日志
2. THE Transaction_Manager SHALL 收集事务执行时间指标（Prometheus）
3. THE Transaction_Manager SHALL 记录慢事务警告（超过配置阈值）
4. THE Transaction_Manager SHALL 支持事务追踪ID，便于关联日志

### Requirement 10: 与现有代码兼容

**User Story:** 作为开发者，我需要新的事务管理与现有代码兼容，以便平滑升级。

#### Acceptance Criteria

1. THE 新实现 SHALL 保持 @Transactional 装饰器的现有 API 不变
2. THE 新实现 SHALL 支持现有的 IsolationLevel 和 Propagation 枚举
3. WHEN 未配置新特性 THEN Transaction_Manager SHALL 使用与当前相同的默认行为
4. THE 新实现 SHALL 提供迁移指南文档


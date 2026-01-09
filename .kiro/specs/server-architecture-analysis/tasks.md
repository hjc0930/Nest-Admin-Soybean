# Implementation Plan: Server 架构优化

## Overview

基于架构分析设计文档，本实现计划将分阶段完成 P0（紧急）、P1（重要）、P2（优化）级别的改进任务。所有任务使用 TypeScript 实现，遵循 NestJS 最佳实践。

## Tasks

### P0 级别 - 紧急任务（影响系统稳定性和安全性）

- [x] 1. 评估并按需使用高级装饰器
  - [x] 1.1 审计现有装饰器使用情况
    - 检查 @Idempotent、@Lock、@CircuitBreaker、@Version、@TenantJob 的实现状态
    - 识别适合使用这些装饰器的业务场景
    - _Requirements: 3.5.2_
  - [x] 1.2 在关键业务场景应用 @Idempotent 装饰器
    - 识别需要幂等性的操作（如订单创建、支付等）
    - 为这些操作添加 @Idempotent 装饰器
    - _Requirements: 3.5.2_
  - [x] 1.3 在并发场景应用 @Lock 装饰器
    - 识别需要分布式锁的场景（如库存扣减、余额变更）
    - 为这些操作添加 @Lock 装饰器
    - _Requirements: 3.5.2_
  - [x] 1.4 在外部服务调用场景应用 @CircuitBreaker 装饰器
    - 识别调用外部服务的代码（短信、邮件、第三方API）
    - 为这些调用添加 @CircuitBreaker 装饰器
    - _Requirements: 3.5.2_
  - [x] 1.5 完善 @Version 乐观锁实现
    - 实现 @Version 装饰器的具体逻辑
    - 添加使用示例和文档
    - _Requirements: 3.5.2_
  - [x]* 1.6 为装饰器编写单元测试（可选，已有现有测试覆盖）
    - 测试 @Idempotent 装饰器的幂等性保证
    - 测试 @Lock 装饰器的锁获取和释放
    - 测试 @CircuitBreaker 装饰器的熔断逻辑
    - _Requirements: 3.5.2_

- [-] 2. 完善权限通配符支持
  - [x] 2.1 修改 PermissionGuard 支持通配符匹配
    - 在 `server/src/core/guards/permission.guard.ts` 中添加通配符匹配逻辑
    - 支持 `system:user:*` 匹配 `system:user:add`、`system:user:edit` 等
    - _Requirements: 5.3_
  - [x] 2.2 编写权限通配符匹配的单元测试
    - 测试精确匹配
    - 测试通配符匹配
    - 测试超级权限 `*:*:*`
    - _Requirements: 5.3_

- [x] 3. 增加 API 限流细粒度控制
  - [x] 3.1 实现接口级别的 @Throttle 装饰器配置
    - 支持在 Controller 方法上配置不同的限流参数
    - 支持覆盖全局限流配置
    - _Requirements: 5.4_
  - [x] 3.2 编写限流功能的单元测试
    - 测试全局限流
    - 测试接口级别限流覆盖
    - _Requirements: 5.4_

- [ ] 4. 数据权限方法复用
  - [ ] 4.1 创建 DataPermissionService 公共服务
    - 将 `buildDataScopeConditions` 方法从 UserService 抽取到公共服务
    - 提供通用的数据权限构建方法
    - _Requirements: 3.1.3_
  - [ ] 4.2 重构 UserService 使用 DataPermissionService
    - 修改 UserService 调用公共数据权限服务
    - 确保功能不变
    - _Requirements: 3.1.3_
  - [ ] 4.3 编写 DataPermissionService 的单元测试
    - 测试各种数据权限范围的条件构建
    - 测试多角色数据权限合并
    - _Requirements: 3.1.3_

- [ ] 5. Checkpoint - P0 任务验收
  - 确保所有 P0 任务完成
  - 运行所有测试确保通过
  - 如有问题请与用户确认

### P1 级别 - 重要任务（影响系统可维护性和扩展性）

- [x] 6. 完善事务传播行为实现
  - [x] 6.1 集成 CLS 模块实现事务上下文传递
    - 安装并配置 `cls-hooked` 或 `@nestjs/cls`
    - 实现事务上下文的存储和获取
    - _Requirements: 3.5_
  - [x] 6.2 实现 REQUIRES_NEW 传播行为
    - 实现挂起当前事务的逻辑
    - 创建新事务执行
    - _Requirements: 3.5_
  - [x] 6.3 实现 MANDATORY 传播行为
    - 实现检查当前事务是否存在
    - 不存在时抛出异常
    - _Requirements: 3.5_
  - [ ]* 6.4 编写事务传播行为的单元测试
    - 测试 REQUIRED 传播行为
    - 测试 REQUIRES_NEW 传播行为
    - 测试 MANDATORY 传播行为
    - _Requirements: 3.5_

- [x] 7. 完善 DataLoader 覆盖
  - [x] 7.1 分析需要 DataLoader 的关联查询
    - 识别常用的关联查询场景
    - 确定需要创建的 Loader 列表
    - _Requirements: 4.2_
  - [x] 7.2 创建 Menu、Post、Dict 等常用 Loader
    - 实现 MenuLoader
    - 实现 PostLoader
    - 实现 DictLoader
    - _Requirements: 4.2_
  - [ ]* 7.3 编写 DataLoader 的单元测试
    - 测试批量加载功能
    - 测试缓存功能
    - _Requirements: 4.2_

- [ ] 8. 增加分布式追踪
  - [ ] 8.1 集成 OpenTelemetry
    - 安装 `@opentelemetry/sdk-node` 相关包
    - 配置 Tracer Provider
    - _Requirements: 4.5_
  - [ ] 8.2 配置 HTTP 请求追踪
    - 添加 HTTP 请求的 Span 创建
    - 传递 Trace Context
    - _Requirements: 4.5_
  - [ ] 8.3 配置数据库查询追踪
    - 添加 Prisma 查询的 Span 创建
    - 记录查询参数和执行时间
    - _Requirements: 4.5_
  - [ ]* 8.4 编写追踪功能的集成测试
    - 测试 Span 创建
    - 测试 Context 传递
    - _Requirements: 4.5_

- [ ] 9. 代码生成器增强
  - [ ] 9.1 支持前端代码生成
    - 生成 Vue 组件模板
    - 生成 API 调用代码
    - 生成类型定义
    - _Requirements: 7.4_
  - [ ] 9.2 支持自定义模板
    - 实现模板引擎集成
    - 支持用户自定义模板
    - _Requirements: 7.4_
  - [ ]* 9.3 编写代码生成器的单元测试
    - 测试后端代码生成
    - 测试前端代码生成
    - _Requirements: 7.4_

- [ ] 10. Checkpoint - P1 任务验收
  - 确保所有 P1 任务完成
  - 运行所有测试确保通过
  - 如有问题请与用户确认

### P2 级别 - 优化任务（提升开发体验和代码质量）

- [x] 11. Service 拆分优化
  - [x] 11.1 分析过大的 Service 文件
    - 识别超过 300 行的 Service
    - 确定拆分方案
    - _Requirements: 3.1.6_
  - [x] 11.2 拆分 UserService 为更小的子服务
    - 确保每个子服务不超过 300 行
    - 保持功能完整性
    - _Requirements: 3.1.6_
  - [ ]* 11.3 编写拆分后服务的单元测试（可选）
    - 确保功能不变
    - 测试服务间协作
    - _Requirements: 3.1.6_

- [x] 12. 增加 API 文档自动化
  - [x] 12.1 配置 @nestjs/swagger 插件自动生成
    - 启用 CLI 插件
    - 配置自动类型推断
    - _Requirements: 7.2_
  - [x] 12.2 增加示例数据和错误码文档
    - 为 DTO 添加示例值
    - 生成错误码文档
    - _Requirements: 7.2_

- [ ] 13. 增加代码质量检查
  - [ ] 13.1 集成 ESLint 复杂度规则
    - 配置圈复杂度检查
    - 配置认知复杂度检查
    - _Requirements: 3.3.1_
  - [ ] 13.2 配置 SonarQube（可选）
    - 安装 SonarQube Scanner
    - 配置质量门禁
    - _Requirements: 3.3.1_

- [x] 14. 优化测试覆盖率
  - [x] 14.1 增加核心业务逻辑的单元测试
    - 识别未覆盖的核心逻辑
    - 编写单元测试
    - _Requirements: 3.3.6_
  - [x] 14.2 增加属性测试覆盖
    - 为核心数据模型添加属性测试
    - 为关键算法添加属性测试
    - _Requirements: 3.3.6_
  - [x] 14.3 增加边界条件测试
    - 识别边界条件
    - 编写边界测试用例
    - _Requirements: 3.3.6_

- [x] 15. 增加性能监控仪表盘
  - [x] 15.1 配置 Grafana 仪表盘
    - 创建 HTTP 请求监控面板
    - 创建数据库性能监控面板
    - 创建缓存命中率监控面板
    - _Requirements: 4.4_
  - [x] 15.2 增加告警规则
    - 配置响应时间告警
    - 配置错误率告警
    - 配置资源使用告警
    - _Requirements: 4.4_

- [-] 16. Final Checkpoint - 全部任务验收
  - 确保所有任务完成
  - 运行完整测试套件
  - 生成测试覆盖率报告
  - 如有问题请与用户确认

## Notes

- 任务标记 `*` 的为可选测试任务，可根据时间安排决定是否执行
- 每个任务都引用了对应的需求编号，便于追溯
- Checkpoint 任务用于阶段性验收，确保质量
- P0 任务应优先完成，P1 和 P2 可根据实际情况调整顺序

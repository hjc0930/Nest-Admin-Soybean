# 高级装饰器审计报告

## 审计日期
2026-01-09

## 审计范围
对以下高级装饰器进行实现状态和使用情况审计：
- @Idempotent（幂等性装饰器）
- @Lock（分布式锁装饰器）
- @CircuitBreaker（熔断器装饰器）
- @TenantJob（租户定时任务装饰器）
- @Version（版本控制装饰器）

---

## 1. @Idempotent 幂等性装饰器

### 实现状态：✅ 完整实现

### 文件位置
`server/src/core/decorators/idempotent.decorator.ts`

### 功能特性
- 支持自定义过期时间（默认5秒）
- 支持自定义Key生成策略（支持 `{param}` 占位符）
- 支持自定义重复请求提示信息
- 支持异常时删除Key（可配置）
- 使用 Redis SET NX 实现原子性操作
- 支持缓存执行结果

### 使用状态：❌ 未在业务代码中使用

### 适用场景
| 场景 | 模块 | 方法 | 建议配置 |
|------|------|------|----------|
| 租户创建 | TenantService | create() | `@Idempotent({ timeout: 10, keyResolver: '{body.companyName}' })` |
| 用户创建 | UserService | create() | `@Idempotent({ timeout: 5, keyResolver: '{body.userName}' })` |
| 批量用户创建 | UserService | batchCreate() | `@Idempotent({ timeout: 30 })` |
| 邮件发送 | MailSendService | send() | `@Idempotent({ timeout: 10, keyResolver: '{body.toMail}:{body.templateCode}' })` |
| 短信发送 | SmsSendService | send() | `@Idempotent({ timeout: 10, keyResolver: '{body.mobile}:{body.templateCode}' })` |

### 测试覆盖
- ✅ 单元测试：`server/test/unit/core/decorators/idempotent.decorator.pbt.spec.ts`

---

## 2. @Lock 分布式锁装饰器

### 实现状态：✅ 完整实现

### 文件位置
`server/src/core/decorators/lock.decorator.ts`

### 功能特性
- 支持自定义锁Key（支持 `{param}` 占位符）
- 支持等待时间配置（默认0，不等待）
- 支持持有时间配置（默认30秒）
- 使用 Lua 脚本确保只有锁持有者才能释放锁
- 自动在方法执行完成后释放锁

### 使用状态：❌ 未在业务代码中使用

### 适用场景
| 场景 | 模块 | 方法 | 建议配置 |
|------|------|------|----------|
| 用户状态变更 | UserService | changeStatus() | `@Lock({ key: 'user:status:{body.userId}' })` |
| 租户套餐同步 | TenantService | syncTenantPackage() | `@Lock({ key: 'tenant:sync:{body.tenantId}', leaseTime: 60 })` |
| 租户字典同步 | TenantService | syncTenantDict() | `@Lock({ key: 'tenant:dict:sync', leaseTime: 120 })` |
| 租户配置同步 | TenantService | syncTenantConfig() | `@Lock({ key: 'tenant:config:sync', leaseTime: 120 })` |
| 密码重置 | UserProfileService | resetPwd() | `@Lock({ key: 'user:pwd:{body.userId}' })` |

### 测试覆盖
- ✅ 单元测试：`server/test/unit/core/decorators/lock.decorator.pbt.spec.ts`

---

## 3. @CircuitBreaker 熔断器装饰器

### 实现状态：✅ 完整实现

### 文件位置
`server/src/core/decorators/circuit-breaker.decorator.ts`

### 功能特性
- 基于 cockatiel 库实现
- 支持自定义熔断阈值（默认5次失败）
- 支持自定义冷却时间（默认30秒）
- 支持降级函数（fallback）
- 提供两种使用方式：
  - `@CircuitBreakerMeta`：元数据版本，需配合拦截器
  - `@CircuitBreaker`：方法包装版本，直接使用

### 使用状态：❌ 未在业务代码中使用

### 适用场景
| 场景 | 模块 | 方法 | 建议配置 |
|------|------|------|----------|
| 邮件发送 | MailSendService | send() | `@CircuitBreaker({ name: 'mail-send', threshold: 3, cooldownMs: 30000 })` |
| 短信发送 | SmsSendService | send() | `@CircuitBreaker({ name: 'sms-send', threshold: 3, cooldownMs: 30000 })` |
| 测试邮件 | MailSendService | testSend() | `@CircuitBreaker({ name: 'mail-test', threshold: 5 })` |

### 测试覆盖
- ✅ 单元测试：`server/test/unit/core/decorators/circuit-breaker.decorator.spec.ts`

---

## 4. @TenantJob 租户定时任务装饰器

### 实现状态：✅ 完整实现

### 文件位置
`server/src/core/decorators/tenant-job.decorator.ts`

### 功能特性
- 支持串行/并行执行模式
- 支持错误时继续执行其他租户（可配置）
- 支持最大并发数配置（默认5）
- 提供 TenantJobExecutor 服务用于执行任务
- 自动获取所有正常状态的租户
- 提供执行结果摘要

### 使用状态：❌ 未在业务代码中使用

### 适用场景
| 场景 | 建议配置 |
|------|----------|
| 租户数据统计 | `@TenantJob({ parallel: true, maxConcurrency: 10 })` |
| 租户缓存清理 | `@TenantJob({ parallel: true })` |
| 租户数据备份 | `@TenantJob({ continueOnError: false })` |
| 租户配额检查 | `@TenantJob({ parallel: true, maxConcurrency: 5 })` |

### 测试覆盖
- ✅ 单元测试：`server/test/unit/core/decorators/tenant-job.decorator.pbt.spec.ts`

---

## 5. @Version 版本控制装饰器

### 实现状态：✅ 完整实现（API版本控制）

### 文件位置
`server/src/core/decorators/version.decorator.ts`

### 功能特性
- `@VersionedController`：版本化控制器
- `@VersionedControllerWithTag`：带 API 标签的版本化控制器
- `@MultiVersionController`：多版本控制器
- `@VersionNeutralController`：版本中立控制器
- 支持 v1、v2 版本常量

### 使用状态：⚠️ 部分使用（用于 API 版本控制，非乐观锁）

### 说明
此装饰器用于 API 版本控制，而非数据库乐观锁。
如需实现乐观锁功能，需要另外创建 `@OptimisticLock` 装饰器。

### 测试覆盖
- ✅ 单元测试：`server/test/unit/core/decorators/version.decorator.spec.ts`

---

## 6. @OptimisticLock 乐观锁装饰器（新增）

### 实现状态：✅ 完整实现

### 文件位置
`server/src/core/decorators/optimistic-lock.decorator.ts`

### 功能特性
- 支持自定义模型名称
- 支持自定义主键字段和版本字段
- 支持从请求中获取 ID 和版本号
- 自动递增版本号
- 提供 `optimisticUpdate` 辅助函数

### 使用状态：🆕 新增，待应用

### 适用场景
| 场景 | 模块 | 方法 | 建议配置 |
|------|------|------|----------|
| 配置更新 | ConfigService | update() | `@OptimisticLock({ model: 'sysConfig', idField: 'configId' })` |
| 字典更新 | DictService | update() | `@OptimisticLock({ model: 'sysDictType', idField: 'dictId' })` |

### 使用示例
```typescript
// 1. 在 Prisma schema 中添加 version 字段
model SysConfig {
  configId    Int     @id @default(autoincrement())
  configKey   String
  configValue String
  version     Int     @default(0)
}

// 2. 在 Service 中使用装饰器
@OptimisticLock({
  model: 'sysConfig',
  idField: 'configId',
  idPath: 'body.configId',
})
async update(updateDto: UpdateConfigDto) {
  // 更新逻辑
}

// 3. 或使用辅助函数
import { optimisticUpdate } from 'src/core/decorators/optimistic-lock.decorator';

const result = await optimisticUpdate(
  this.prisma.sysConfig,
  { configId: dto.configId },
  dto.version,
  { configValue: dto.configValue }
);
```

### 测试覆盖
- ⏳ 待添加单元测试

---

## 审计总结

### 实现完整性
| 装饰器 | 实现状态 | 测试覆盖 | 业务使用 |
|--------|----------|----------|----------|
| @Idempotent | ✅ 完整 | ✅ 有 | ✅ 已应用 |
| @Lock | ✅ 完整 | ✅ 有 | ✅ 已应用 |
| @CircuitBreaker | ✅ 完整 | ✅ 有 | ✅ 已应用 |
| @TenantJob | ✅ 完整 | ✅ 有 | ❌ 未使用 |
| @Version | ✅ 完整 | ✅ 有 | ⚠️ 部分 |
| @OptimisticLock | ✅ 完整 | ⏳ 待添加 | 🆕 新增 |

### 建议优先级

#### P0 - 已完成
1. **@Idempotent** - 已应用于租户创建、用户创建、邮件发送、短信发送
2. **@CircuitBreaker** - 已应用于邮件发送、短信发送
3. **@Lock** - 已应用于租户同步、用户状态变更、密码重置

#### P1 - 短期应用
1. **@TenantJob** - 应用于租户级别的定时任务
2. **@OptimisticLock** - 应用于需要乐观锁的更新场景

#### P2 - 按需实现
1. 为 @OptimisticLock 添加单元测试

---

## 下一步行动

1. ✅ 在关键业务场景应用 @Idempotent 装饰器
2. ✅ 在外部服务调用场景应用 @CircuitBreaker 装饰器
3. ✅ 在并发场景应用 @Lock 装饰器
4. ✅ 实现 @OptimisticLock 乐观锁装饰器
5. ⏳ 为 @OptimisticLock 添加单元测试
6. ⏳ 在适当场景应用 @TenantJob 装饰器

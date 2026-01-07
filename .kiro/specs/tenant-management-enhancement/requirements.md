# Requirements Document

## Introduction

本文档定义了 NestJS 版本 ruoyi-vue-pro 的完整功能需求。目标是实现与 ruoyi-vue-pro 功能对等的 NestJS + Vue3 + Naive UI 版本。

## 功能模块对比总览

### 一、系统功能模块

| 功能 | ruoyi-vue-pro | 本项目状态 | 优先级 |
|------|---------------|-----------|--------|
| 用户管理 | ✅ | ✅ 已实现 | - |
| 在线用户 | ✅ | ✅ 已实现 | - |
| 角色管理 | ✅ | ✅ 已实现 | - |
| 菜单管理 | ✅ | ✅ 已实现 | - |
| 部门管理 | ✅ | ✅ 已实现 | - |
| 岗位管理 | ✅ | ✅ 已实现 | - |
| 租户管理 | ✅ | ✅ 已实现 | - |
| 租户套餐 | ✅ | ✅ 已实现 | - |
| 字典管理 | ✅ | ✅ 已实现 | - |
| 短信管理 | ✅ | ❌ 未实现 | P1 |
| 邮件管理 | ✅ | ❌ 未实现 | P1 |
| 站内信 | ✅ | ❌ 未实现 | P1 |
| 操作日志 | ✅ | ✅ 已实现 | - |
| 登录日志 | ✅ | ✅ 已实现 | - |
| 错误码管理 | ✅ | ❌ 未实现 | P2 |
| 通知公告 | ✅ | ✅ 已实现 | - |
| 敏感词 | ✅ | ❌ 未实现 | P2 |
| 应用管理(SSO) | ✅ | ⚠️ 部分实现 | P1 |
| 地区管理 | ✅ | ❌ 未实现 | P3 |

### 二、基础设施模块

| 功能 | ruoyi-vue-pro | 本项目状态 | 优先级 |
|------|---------------|-----------|--------|
| 代码生成 | ✅ | ✅ 已实现 | - |
| 系统接口(Swagger) | ✅ | ✅ 已实现 | - |
| 数据库文档 | ✅ | ❌ 未实现 | P3 |
| 表单构建 | ✅ | ❌ 未实现 | P2 |
| 配置管理 | ✅ | ✅ 已实现 | - |
| 文件服务 | ✅ | ✅ 已实现 | - |
| WebSocket | ✅ | ❌ 未实现 | P2 |
| API日志 | ✅ | ✅ 已实现 | - |
| MySQL监控 | ✅ | ❌ 未实现 | P2 |
| Redis监控 | ✅ | ✅ 已实现 | - |
| 消息队列 | ✅ | ✅ 已实现(Bull) | - |
| 服务监控 | ✅ | ⚠️ 部分实现 | P2 |
| 链路追踪 | ✅ | ❌ 未实现 | P3 |
| 日志中心 | ✅ | ❌ 未实现 | P3 |
| 服务保障(限流/幂等) | ✅ | ⚠️ 部分实现 | P1 |
| 单元测试 | ✅ | ✅ 已实现 | - |

### 三、工作流程模块

| 功能 | ruoyi-vue-pro | 本项目状态 | 优先级 |
|------|---------------|-----------|--------|
| BPMN设计器 | ✅ | ❌ 未实现 | P1 |
| 钉钉/飞书设计器 | ✅ | ❌ 未实现 | P1 |
| 会签/或签 | ✅ | ❌ 未实现 | P1 |
| 抄送/驳回/转办 | ✅ | ❌ 未实现 | P1 |
| 表单权限 | ✅ | ❌ 未实现 | P1 |
| 超时审批 | ✅ | ❌ 未实现 | P2 |
| 父子流程 | ✅ | ❌ 未实现 | P2 |
| 条件/并行分支 | ✅ | ❌ 未实现 | P1 |

### 四、支付系统模块

| 功能 | ruoyi-vue-pro | 本项目状态 | 优先级 |
|------|---------------|-----------|--------|
| 应用信息 | ✅ | ❌ 未实现 | P2 |
| 支付订单 | ✅ | ❌ 未实现 | P2 |
| 退款订单 | ✅ | ❌ 未实现 | P2 |
| 回调通知 | ✅ | ❌ 未实现 | P2 |

### 五、数据报表模块

| 功能 | ruoyi-vue-pro | 本项目状态 | 优先级 |
|------|---------------|-----------|--------|
| 报表设计器 | ✅ | ❌ 未实现 | P2 |
| 大屏设计器 | ✅ | ❌ 未实现 | P3 |

### 六、微信公众号模块

| 功能 | ruoyi-vue-pro | 本项目状态 | 优先级 |
|------|---------------|-----------|--------|
| 账号管理 | ✅ | ❌ 未实现 | P3 |
| 粉丝管理 | ✅ | ❌ 未实现 | P3 |
| 消息管理 | ✅ | ❌ 未实现 | P3 |
| 模版消息 | ✅ | ❌ 未实现 | P3 |
| 自动回复 | ✅ | ❌ 未实现 | P3 |
| 菜单管理 | ✅ | ❌ 未实现 | P3 |
| 素材管理 | ✅ | ❌ 未实现 | P3 |

### 七、会员中心模块

| 功能 | ruoyi-vue-pro | 本项目状态 | 优先级 |
|------|---------------|-----------|--------|
| 会员管理 | ✅ | ❌ 未实现 | P2 |
| 会员标签 | ✅ | ❌ 未实现 | P2 |
| 会员等级 | ✅ | ❌ 未实现 | P2 |
| 会员分组 | ✅ | ❌ 未实现 | P2 |
| 积分签到 | ✅ | ❌ 未实现 | P2 |

### 八、商城/ERP/CRM/AI模块

| 功能 | ruoyi-vue-pro | 本项目状态 | 优先级 |
|------|---------------|-----------|--------|
| 商城系统 | ✅ | ❌ 未实现 | P3 |
| ERP系统 | ✅ | ❌ 未实现 | P3 |
| CRM系统 | ✅ | ❌ 未实现 | P3 |
| AI大模型 | ✅ | ❌ 未实现 | P3 |

## 实现优先级说明

- **P1 (高优先级)**: 核心基础功能，影响系统完整性
- **P2 (中优先级)**: 重要业务功能，提升系统价值
- **P3 (低优先级)**: 扩展功能，可后续迭代

## 本次迭代范围 (Phase 1)

本次迭代聚焦于 P1 优先级功能的实现：

1. **短信管理** - 短信渠道、模板、日志
2. **邮件管理** - 邮箱账号、模板、发送日志
3. **站内信** - 站内信模板、消息管理
4. **工作流程** - 基础审批流程功能
5. **服务保障** - 分布式锁、幂等、限流增强
6. **租户增强** - 统计仪表盘、配额管理、审计日志

## Glossary

- **Tenant_Dashboard**: 租户统计仪表盘，展示租户相关的统计数据和可视化图表
- **Tenant_Quota**: 租户配额，定义租户可使用的资源限制（用户数、存储空间等）
- **Tenant_Billing**: 租户账单/计费系统，管理租户的费用和支付记录
- **Tenant_Audit_Log**: 租户审计日志，记录租户内的所有重要操作
- **Super_Admin**: 超级管理员，拥有管理所有租户的权限
- **Tenant_Admin**: 租户管理员，管理单个租户内的资源
- **Quota_Type**: 配额类型，如用户数量、存储空间、API调用次数等
- **Billing_Cycle**: 计费周期，如月度、季度、年度
- **Audit_Action**: 审计操作类型，如登录、数据修改、权限变更等

## Requirements

### Requirement 1: 租户统计仪表盘

**User Story:** As a 超级管理员, I want to 查看所有租户的统计数据和趋势图表, so that I can 了解平台整体运营状况并做出决策。

#### Acceptance Criteria

1. WHEN 超级管理员访问租户仪表盘页面 THEN THE Tenant_Dashboard SHALL 显示租户总数、活跃租户数、新增租户数统计卡片
2. WHEN 超级管理员访问租户仪表盘页面 THEN THE Tenant_Dashboard SHALL 显示用户总数、在线用户数、今日登录用户数统计卡片
3. WHEN 超级管理员访问租户仪表盘页面 THEN THE Tenant_Dashboard SHALL 显示存储使用总量、API调用总量统计卡片
4. WHEN 超级管理员选择时间范围 THEN THE Tenant_Dashboard SHALL 显示该时间段内的租户增长趋势折线图
5. WHEN 超级管理员查看仪表盘 THEN THE Tenant_Dashboard SHALL 显示租户套餐分布饼图
6. WHEN 超级管理员查看仪表盘 THEN THE Tenant_Dashboard SHALL 显示即将到期的租户列表（30天内）
7. WHEN 超级管理员查看仪表盘 THEN THE Tenant_Dashboard SHALL 显示配额使用率TOP10的租户列表
8. WHEN 数据加载中 THEN THE Tenant_Dashboard SHALL 显示加载状态指示器

### Requirement 2: 租户配额管理

**User Story:** As a 超级管理员, I want to 管理每个租户的资源配额, so that I can 控制资源使用并确保平台稳定运行。

#### Acceptance Criteria

1. WHEN 超级管理员访问配额管理页面 THEN THE Tenant_Quota SHALL 显示所有租户的配额使用情况列表
2. WHEN 超级管理员查看租户配额 THEN THE Tenant_Quota SHALL 显示用户数量配额及使用量
3. WHEN 超级管理员查看租户配额 THEN THE Tenant_Quota SHALL 显示存储空间配额及使用量（单位：GB）
4. WHEN 超级管理员查看租户配额 THEN THE Tenant_Quota SHALL 显示API调用次数配额及使用量（按月统计）
5. WHEN 超级管理员编辑租户配额 THEN THE Tenant_Quota SHALL 允许修改各项配额限制值
6. WHEN 配额值设置为-1 THEN THE Tenant_Quota SHALL 表示该配额不受限制
7. WHEN 租户配额使用率超过80% THEN THE Tenant_Quota SHALL 显示警告标识
8. WHEN 租户配额使用率达到100% THEN THE Tenant_Quota SHALL 显示危险标识并阻止超额使用
9. IF 配额修改失败 THEN THE Tenant_Quota SHALL 显示错误信息并保持原有配额值
10. WHEN 超级管理员搜索租户 THEN THE Tenant_Quota SHALL 支持按租户名称、租户编号筛选

### Requirement 3: 租户账单/计费管理

**User Story:** As a 超级管理员, I want to 管理租户的账单和计费信息, so that I can 跟踪收入并管理租户付款状态。

#### Acceptance Criteria

1. WHEN 超级管理员访问账单管理页面 THEN THE Tenant_Billing SHALL 显示所有租户的账单列表
2. WHEN 超级管理员查看账单列表 THEN THE Tenant_Billing SHALL 显示账单编号、租户名称、金额、状态、创建时间
3. WHEN 超级管理员创建账单 THEN THE Tenant_Billing SHALL 允许选择租户、计费周期、金额、备注
4. WHEN 超级管理员查看账单详情 THEN THE Tenant_Billing SHALL 显示账单明细项（套餐费用、超额费用等）
5. WHEN 超级管理员更新账单状态 THEN THE Tenant_Billing SHALL 支持待支付、已支付、已取消、已逾期状态
6. WHEN 账单状态为已逾期 THEN THE Tenant_Billing SHALL 显示逾期天数和逾期金额
7. WHEN 超级管理员导出账单 THEN THE Tenant_Billing SHALL 支持导出Excel格式的账单报表
8. WHEN 超级管理员搜索账单 THEN THE Tenant_Billing SHALL 支持按租户、状态、时间范围筛选
9. WHEN 超级管理员查看账单统计 THEN THE Tenant_Billing SHALL 显示本月收入、待收款、已逾期金额汇总
10. IF 账单创建失败 THEN THE Tenant_Billing SHALL 显示错误信息并保留表单数据

### Requirement 4: 租户审计日志

**User Story:** As a 超级管理员, I want to 查看租户内的所有操作审计日志, so that I can 追踪问题、确保合规并进行安全审计。

#### Acceptance Criteria

1. WHEN 超级管理员访问审计日志页面 THEN THE Tenant_Audit_Log SHALL 显示所有租户的操作日志列表
2. WHEN 超级管理员查看日志列表 THEN THE Tenant_Audit_Log SHALL 显示时间、租户、操作人、操作类型、操作内容、IP地址
3. WHEN 超级管理员筛选日志 THEN THE Tenant_Audit_Log SHALL 支持按租户、操作类型、时间范围、操作人筛选
4. WHEN 超级管理员查看日志详情 THEN THE Tenant_Audit_Log SHALL 显示操作前后的数据变化（JSON格式）
5. WHEN 超级管理员导出日志 THEN THE Tenant_Audit_Log SHALL 支持导出Excel格式的日志报表
6. THE Tenant_Audit_Log SHALL 记录用户登录、登出操作
7. THE Tenant_Audit_Log SHALL 记录数据创建、修改、删除操作
8. THE Tenant_Audit_Log SHALL 记录权限变更操作
9. THE Tenant_Audit_Log SHALL 记录配置修改操作
10. WHEN 日志数据量大时 THEN THE Tenant_Audit_Log SHALL 支持分页加载和虚拟滚动
11. IF 日志查询超时 THEN THE Tenant_Audit_Log SHALL 显示超时提示并建议缩小查询范围

### Requirement 5: 租户管理员视角

**User Story:** As a 租户管理员, I want to 查看本租户的配额使用情况和账单信息, so that I can 了解资源使用状况并及时续费。

#### Acceptance Criteria

1. WHEN 租户管理员访问配额页面 THEN THE Tenant_Quota SHALL 仅显示本租户的配额使用情况
2. WHEN 租户管理员访问账单页面 THEN THE Tenant_Billing SHALL 仅显示本租户的账单列表
3. WHEN 租户管理员访问审计日志页面 THEN THE Tenant_Audit_Log SHALL 仅显示本租户的操作日志
4. WHEN 配额使用率超过80% THEN THE Tenant_Quota SHALL 在页面顶部显示警告通知
5. WHEN 有未支付账单 THEN THE Tenant_Billing SHALL 在页面顶部显示待支付提醒


---

## Phase 1 详细需求

### Requirement 1: 短信管理

**User Story:** As a 系统管理员, I want to 配置短信渠道和模板, so that I can 向用户发送短信通知。

#### Acceptance Criteria

1. WHEN 管理员访问短信渠道页面 THEN THE System SHALL 显示所有短信渠道列表
2. WHEN 管理员创建短信渠道 THEN THE System SHALL 支持阿里云、腾讯云、华为云等主流平台
3. WHEN 管理员配置短信模板 THEN THE System SHALL 支持变量占位符配置
4. WHEN 系统发送短信 THEN THE System SHALL 记录发送日志（状态、时间、内容）
5. WHEN 管理员查看短信日志 THEN THE System SHALL 支持按手机号、状态、时间筛选
6. IF 短信发送失败 THEN THE System SHALL 记录失败原因并支持重发

### Requirement 2: 邮件管理

**User Story:** As a 系统管理员, I want to 配置邮箱账号和邮件模板, so that I can 向用户发送邮件通知。

#### Acceptance Criteria

1. WHEN 管理员访问邮箱账号页面 THEN THE System SHALL 显示所有邮箱账号列表
2. WHEN 管理员创建邮箱账号 THEN THE System SHALL 支持SMTP配置（主机、端口、SSL）
3. WHEN 管理员配置邮件模板 THEN THE System SHALL 支持HTML模板和变量占位符
4. WHEN 系统发送邮件 THEN THE System SHALL 记录发送日志
5. WHEN 管理员查看邮件日志 THEN THE System SHALL 支持按收件人、状态、时间筛选
6. IF 邮件发送失败 THEN THE System SHALL 记录失败原因

### Requirement 3: 站内信

**User Story:** As a 系统管理员, I want to 发送站内信通知, so that I can 在系统内向用户推送消息。

#### Acceptance Criteria

1. WHEN 管理员访问站内信模板页面 THEN THE System SHALL 显示所有模板列表
2. WHEN 管理员创建站内信模板 THEN THE System SHALL 支持标题、内容、变量配置
3. WHEN 系统发送站内信 THEN THE System SHALL 支持单发和群发
4. WHEN 用户登录系统 THEN THE System SHALL 显示未读站内信数量
5. WHEN 用户查看站内信 THEN THE System SHALL 标记为已读
6. WHEN 用户删除站内信 THEN THE System SHALL 软删除消息记录

### Requirement 4: 租户统计仪表盘

**User Story:** As a 超级管理员, I want to 查看所有租户的统计数据, so that I can 了解平台运营状况。

#### Acceptance Criteria

1. WHEN 管理员访问仪表盘 THEN THE System SHALL 显示租户总数、活跃数、新增数
2. WHEN 管理员访问仪表盘 THEN THE System SHALL 显示用户总数、在线数、今日登录数
3. WHEN 管理员选择时间范围 THEN THE System SHALL 显示租户增长趋势图
4. WHEN 管理员查看仪表盘 THEN THE System SHALL 显示套餐分布饼图
5. WHEN 管理员查看仪表盘 THEN THE System SHALL 显示即将到期租户列表

### Requirement 5: 租户配额管理

**User Story:** As a 超级管理员, I want to 管理租户资源配额, so that I can 控制资源使用。

#### Acceptance Criteria

1. WHEN 管理员访问配额页面 THEN THE System SHALL 显示所有租户配额列表
2. WHEN 管理员查看配额 THEN THE System SHALL 显示用户数、存储、API调用配额
3. WHEN 管理员编辑配额 THEN THE System SHALL 允许修改配额限制值
4. WHEN 配额值为-1 THEN THE System SHALL 表示不限制
5. WHEN 使用率超过80% THEN THE System SHALL 显示警告标识
6. WHEN 使用率达到100% THEN THE System SHALL 阻止超额使用

### Requirement 6: 租户审计日志

**User Story:** As a 超级管理员, I want to 查看租户操作日志, so that I can 进行安全审计。

#### Acceptance Criteria

1. WHEN 管理员访问审计日志 THEN THE System SHALL 显示所有租户操作日志
2. WHEN 管理员筛选日志 THEN THE System SHALL 支持按租户、类型、时间筛选
3. WHEN 管理员查看详情 THEN THE System SHALL 显示操作前后数据变化
4. THE System SHALL 记录登录、数据操作、权限变更、配置修改
5. WHEN 管理员导出日志 THEN THE System SHALL 支持Excel导出

### Requirement 7: 租户切换功能

**User Story:** As a 超级管理员, I want to 切换到其他租户, so that I can 查看和管理租户数据。

#### Acceptance Criteria

1. WHEN 超级管理员点击租户切换 THEN THE System SHALL 显示可切换租户列表
2. WHEN 超级管理员选择租户 THEN THE System SHALL 切换到该租户上下文
3. WHEN 切换成功 THEN THE System SHALL 在顶部显示当前租户名称
4. WHEN 超级管理员点击恢复 THEN THE System SHALL 恢复到原租户

### Requirement 8: 服务保障增强

**User Story:** As a 开发者, I want to 使用分布式锁和限流功能, so that I can 保障高并发场景下的服务稳定。

#### Acceptance Criteria

1. THE System SHALL 提供基于Redis的分布式锁装饰器
2. THE System SHALL 提供接口限流装饰器（支持IP、用户维度）
3. THE System SHALL 提供幂等性校验装饰器
4. WHEN 获取锁失败 THEN THE System SHALL 返回友好错误提示
5. WHEN 触发限流 THEN THE System SHALL 返回429状态码
6. WHEN 重复请求 THEN THE System SHALL 返回幂等响应


---

## 核心装饰器/注解对比

### 已实现的装饰器

| 装饰器 | ruoyi-vue-pro | 本项目 | 说明 |
|--------|---------------|--------|------|
| @Operlog | ✅ | ✅ | 操作日志记录 |
| @RequirePermission | ✅ | ✅ | 权限校验 |
| @RequireRole | ✅ | ✅ | 角色校验 |
| @Transactional | ✅ | ✅ | 声明式事务 |
| @Throttle | ✅ | ✅ | 限流（IP/用户/租户维度） |
| @SkipThrottle | ✅ | ✅ | 跳过限流 |
| @CircuitBreaker | ❌ | ✅ | 熔断器（额外功能） |
| @Retry | ❌ | ✅ | 重试（额外功能） |
| @Audit | ✅ | ✅ | 审计日志 |
| @Captcha | ✅ | ✅ | 验证码校验 |

### 需要新增的装饰器

| 装饰器 | ruoyi-vue-pro | 本项目 | 说明 |
|--------|---------------|--------|------|
| @Idempotent | ✅ | ❌ | 幂等性校验 |
| @Lock | ✅ | ❌ | 分布式锁 |
| @DataPermission | ✅ | ❌ | 数据权限 |
| @TenantIgnore | ✅ | ✅ | 忽略租户过滤 |
| @TenantJob | ✅ | ❌ | 租户定时任务 |

### Requirement 9: 幂等性装饰器

**User Story:** As a 开发者, I want to 使用幂等性装饰器, so that I can 防止重复请求导致的数据问题。

#### Acceptance Criteria

1. THE System SHALL 提供 @Idempotent 装饰器
2. WHEN 相同参数的请求在指定时间内重复发送 THEN THE System SHALL 返回幂等响应
3. THE System SHALL 支持配置过期时间（默认5秒）
4. THE System SHALL 支持自定义Key生成策略
5. WHEN 方法执行异常 THEN THE System SHALL 删除幂等Key允许重试
6. THE System SHALL 使用Redis存储幂等状态

### Requirement 10: 分布式锁装饰器

**User Story:** As a 开发者, I want to 使用分布式锁装饰器, so that I can 保证分布式环境下的数据一致性。

#### Acceptance Criteria

1. THE System SHALL 提供 @Lock 装饰器
2. THE System SHALL 支持配置锁Key、等待时间、持有时间
3. WHEN 获取锁失败 THEN THE System SHALL 抛出LockAcquireException
4. THE System SHALL 支持自定义Key生成策略（支持SpEL表达式）
5. THE System SHALL 使用Redisson实现分布式锁
6. WHEN 方法执行完成 THEN THE System SHALL 自动释放锁

### Requirement 11: 数据权限装饰器

**User Story:** As a 开发者, I want to 使用数据权限装饰器, so that I can 实现基于部门的数据隔离。

#### Acceptance Criteria

1. THE System SHALL 提供 @DataPermission 装饰器
2. THE System SHALL 支持5种数据范围：全部、指定部门、本部门、本部门及以下、仅本人
3. WHEN 查询数据时 THEN THE System SHALL 自动拼接数据权限条件
4. THE System SHALL 支持在角色管理中配置数据权限
5. THE System SHALL 支持 enable 属性禁用数据权限
6. THE System SHALL 支持 includeRules/excludeRules 配置

### Requirement 12: 租户定时任务装饰器

**User Story:** As a 开发者, I want to 使用租户定时任务装饰器, so that I can 遍历所有租户执行定时任务。

#### Acceptance Criteria

1. THE System SHALL 提供 @TenantJob 装饰器
2. WHEN 定时任务执行时 THEN THE System SHALL 遍历所有正常状态的租户
3. THE System SHALL 为每个租户设置租户上下文后执行任务逻辑
4. WHEN 某个租户执行失败 THEN THE System SHALL 记录错误并继续执行其他租户
5. THE System SHALL 支持并行/串行执行模式配置


---

## 测试需求

### 测试框架对比

| 测试类型 | ruoyi-vue-pro | 本项目 | 说明 |
|----------|---------------|--------|------|
| 单元测试 | JUnit + Mockito | Jest + Mockito | ✅ 已有 |
| 集成测试 | Spring Test | Supertest | ✅ 已有 |
| E2E测试 | ❌ | ❌ | 需要新增 |
| 属性测试 | ❌ | fast-check | ✅ 已有（额外功能） |
| 覆盖率报告 | JaCoCo | Jest Coverage | ✅ 已有 |

### Requirement 13: 单元测试

**User Story:** As a 开发者, I want to 为所有业务逻辑编写单元测试, so that I can 保证代码质量和功能正确性。

#### Acceptance Criteria

1. THE System SHALL 为每个Service类编写单元测试
2. THE System SHALL 使用Jest作为测试框架
3. THE System SHALL 使用Mock隔离外部依赖
4. THE System SHALL 测试正常流程和异常流程
5. THE System SHALL 单元测试覆盖率达到80%以上
6. WHEN 运行 `npm run test:unit` THEN THE System SHALL 执行所有单元测试

### Requirement 14: 集成测试

**User Story:** As a 开发者, I want to 为所有API接口编写集成测试, so that I can 验证接口的完整功能。

#### Acceptance Criteria

1. THE System SHALL 为每个Controller编写集成测试
2. THE System SHALL 使用Supertest进行HTTP请求测试
3. THE System SHALL 使用测试数据库（SQLite或测试PostgreSQL）
4. THE System SHALL 测试认证、授权、参数校验
5. THE System SHALL 测试成功响应和错误响应
6. WHEN 运行 `npm run test:integration` THEN THE System SHALL 执行所有集成测试

### Requirement 15: E2E测试

**User Story:** As a 开发者, I want to 为关键业务流程编写E2E测试, so that I can 验证端到端的业务流程。

#### Acceptance Criteria

1. THE System SHALL 使用Playwright或Cypress进行E2E测试
2. THE System SHALL 测试用户登录流程
3. THE System SHALL 测试租户管理完整流程
4. THE System SHALL 测试权限控制流程
5. THE System SHALL 测试工作流审批流程（Phase 2）
6. WHEN 运行 `npm run test:e2e` THEN THE System SHALL 执行所有E2E测试

### Requirement 16: 属性测试

**User Story:** As a 开发者, I want to 为核心算法编写属性测试, so that I can 发现边界情况和隐藏bug。

#### Acceptance Criteria

1. THE System SHALL 使用fast-check进行属性测试
2. THE System SHALL 为数据验证逻辑编写属性测试
3. THE System SHALL 为加密/解密逻辑编写属性测试
4. THE System SHALL 为数据转换逻辑编写属性测试
5. THE System SHALL 每个属性测试运行至少100次迭代
6. WHEN 运行 `npm run test:pbt` THEN THE System SHALL 执行所有属性测试

### Requirement 17: 测试覆盖率

**User Story:** As a 项目管理者, I want to 监控测试覆盖率, so that I can 确保代码质量。

#### Acceptance Criteria

1. THE System SHALL 生成测试覆盖率报告
2. THE System SHALL 行覆盖率达到80%以上
3. THE System SHALL 分支覆盖率达到70%以上
4. THE System SHALL 函数覆盖率达到85%以上
5. THE System SHALL 在CI/CD中检查覆盖率阈值
6. IF 覆盖率低于阈值 THEN THE System SHALL 构建失败

### Requirement 18: 测试数据管理

**User Story:** As a 开发者, I want to 使用测试数据工厂, so that I can 快速生成测试数据。

#### Acceptance Criteria

1. THE System SHALL 提供测试数据工厂（Factory）
2. THE System SHALL 为每个实体提供默认工厂
3. THE System SHALL 支持自定义属性覆盖
4. THE System SHALL 支持关联数据自动创建
5. THE System SHALL 支持批量数据生成
6. THE System SHALL 测试后自动清理数据

### 测试目录结构

```
server/
├── test/
│   ├── unit/                    # 单元测试
│   │   ├── module/
│   │   │   ├── system/
│   │   │   │   ├── tenant/
│   │   │   │   │   ├── tenant.service.spec.ts
│   │   │   │   │   └── tenant.repository.spec.ts
│   │   │   │   ├── sms/
│   │   │   │   ├── email/
│   │   │   │   └── message/
│   │   │   └── ...
│   │   └── core/
│   │       ├── decorators/
│   │       │   ├── idempotent.decorator.spec.ts
│   │       │   ├── lock.decorator.spec.ts
│   │       │   └── data-permission.decorator.spec.ts
│   │       └── ...
│   ├── integration/             # 集成测试
│   │   ├── module/
│   │   │   ├── system/
│   │   │   │   ├── tenant.controller.spec.ts
│   │   │   │   ├── sms.controller.spec.ts
│   │   │   │   └── ...
│   │   │   └── ...
│   │   └── setup.ts
│   ├── e2e/                     # E2E测试
│   │   ├── auth.e2e-spec.ts
│   │   ├── tenant.e2e-spec.ts
│   │   └── ...
│   ├── fixtures/                # 测试数据
│   │   ├── tenant.fixture.ts
│   │   ├── user.fixture.ts
│   │   └── ...
│   ├── factories/               # 数据工厂
│   │   ├── tenant.factory.ts
│   │   ├── user.factory.ts
│   │   └── ...
│   └── helpers/                 # 测试辅助
│       ├── test-app.ts
│       ├── test-database.ts
│       └── ...
```

### 测试命令

```bash
# 运行所有测试
npm run test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行E2E测试
npm run test:e2e

# 运行属性测试
npm run test:pbt

# 生成覆盖率报告
npm run test:cov

# 监听模式
npm run test:watch
```

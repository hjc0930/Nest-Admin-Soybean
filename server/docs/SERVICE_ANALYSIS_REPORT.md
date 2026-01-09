# Service 文件分析报告

## 分析日期
2026-01-09

## 分析目标
识别超过 300 行的 Service 文件，确定拆分方案。

## 超过 300 行的 Service 文件清单

| 序号 | 文件路径 | 行数 | 优先级 | 建议 |
|------|----------|------|--------|------|
| 1 | user.service.ts | 1069 | P0 | 需要进一步拆分 |
| 2 | file-manager.service.ts | 1021 | P1 | 建议拆分 |
| 3 | tenant.service.ts | 827 | P1 | 建议拆分 |
| 4 | upload.service.ts | 690 | P2 | 可考虑拆分 |
| 5 | tool.service.ts | 597 | P2 | 可考虑拆分 |
| 6 | tenant-quota.service.ts | 516 | P2 | 可考虑拆分 |
| 7 | tenant-audit.service.ts | 423 | P2 | 可考虑拆分 |
| 8 | redis.service.ts | 405 | P2 | 可考虑拆分 |
| 9 | tenant-dashboard.service.ts | 395 | P2 | 可考虑拆分 |
| 10 | role.service.ts | 394 | P2 | 可考虑拆分 |
| 11 | task.service.ts | 370 | P2 | 可考虑拆分 |
| 12 | notify-message.service.ts | 309 | P2 | 边界值，可暂不处理 |
| 13 | user-auth.service.ts | 301 | - | 边界值，可暂不处理 |

## UserService 详细分析

### 当前状态
- **总行数**: 1069 行
- **已有子服务**: 4 个
  - UserAuthService (301行) - 认证相关
  - UserProfileService (119行) - 个人资料相关
  - UserRoleService (249行) - 角色分配相关
  - UserExportService (40行) - 导出相关

### 功能模块分析

#### 1. 私有辅助方法 (约 100 行)
- `attachDeptInfo()` - 为用户列表附加部门信息
- `buildDataScopeConditions()` - 构建数据权限过滤条件
- `buildDateRange()` - 构建日期范围查询条件

#### 2. 用户 CRUD 操作 (约 350 行)
- `create()` - 创建用户
- `findAll()` - 分页查询用户列表
- `findOne()` - 查询用户详情
- `update()` - 更新用户信息
- `remove()` - 删除用户
- `batchCreate()` - 批量创建用户
- `batchDelete()` - 批量删除用户

#### 3. 状态和查询操作 (约 80 行)
- `changeStatus()` - 修改用户状态
- `findPostAndRoleAll()` - 获取岗位和角色列表
- `deptTree()` - 获取部门树
- `optionselect()` - 获取用户选择列表
- `findByDeptId()` - 根据部门ID查询用户

#### 4. 委托方法 (约 200 行)
- 认证相关委托 (login, register, createToken, parseToken 等)
- 个人资料委托 (profile, updateProfile, updatePwd, resetPwd)
- 角色分配委托 (authRole, updateAuthRole, allocatedList 等)
- 导出委托 (export)

### 拆分方案

#### 方案：创建 UserCrudService

将用户 CRUD 操作和批量操作抽取到新的 `UserCrudService`：

**新建 UserCrudService 包含：**
- `create()` - 创建用户
- `findAll()` - 分页查询用户列表
- `findOne()` - 查询用户详情
- `update()` - 更新用户信息
- `remove()` - 删除用户
- `batchCreate()` - 批量创建用户
- `batchDelete()` - 批量删除用户
- `changeStatus()` - 修改用户状态
- 私有辅助方法 (attachDeptInfo, buildDataScopeConditions, buildDateRange)

**UserService 保留：**
- 查询辅助方法 (findPostAndRoleAll, deptTree, optionselect, findByDeptId)
- 所有委托方法（保持 API 兼容性）
- 作为门面（Facade）协调各子服务

### 预期效果

| 服务 | 拆分前行数 | 拆分后行数 |
|------|-----------|-----------|
| UserService | 1069 | ~300 |
| UserCrudService | - | ~450 |
| UserAuthService | 301 | 301 |
| UserProfileService | 119 | 119 |
| UserRoleService | 249 | 249 |
| UserExportService | 40 | 40 |

**注意**: UserCrudService 预计约 450 行，仍超过 300 行目标。如需进一步拆分，可考虑：
- 将批量操作 (batchCreate, batchDelete) 抽取到 UserBatchService
- 将数据权限相关方法抽取到 DataPermissionService（已在 P0 任务中规划）

## 其他 Service 拆分建议

### file-manager.service.ts (1021 行)
建议拆分为：
- FileUploadService - 文件上传相关
- FileQueryService - 文件查询相关
- FileOperationService - 文件操作（移动、复制、删除）

### tenant.service.ts (827 行)
建议拆分为：
- TenantCrudService - 租户 CRUD
- TenantConfigService - 租户配置
- TenantInitService - 租户初始化

### upload.service.ts (690 行)
建议拆分为：
- LocalUploadService - 本地上传
- CloudUploadService - 云存储上传
- UploadValidationService - 上传验证

## 总结

1. **UserService** 是当前最需要拆分的服务，已有子服务模式，可继续扩展
2. 建议优先处理 P0 级别的 UserService 拆分
3. 其他 Service 可根据实际需求逐步拆分
4. 拆分时应保持 API 兼容性，使用门面模式

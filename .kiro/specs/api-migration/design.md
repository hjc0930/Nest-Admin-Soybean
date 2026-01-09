# Design Document: API Migration

## Overview

本设计文档描述了将前端项目从手写 API 迁移到自动生成 API 的方案。迁移将按模块进行，确保每个模块迁移后功能正常。

## Migration Strategy

### 迁移原则

1. **按模块迁移** - 每次迁移一个模块，确保该模块功能正常后再迁移下一个
2. **保持向后兼容** - 迁移过程中保留旧 API，直到所有引用都已更新
3. **类型适配** - 处理生成的 API 与现有代码之间的类型差异

### API 映射关系

#### 认证模块 (auth)

| Legacy API | Generated API |
|------------|---------------|
| `fetchLogin` | `mainControllerLogin` |
| `fetchCaptchaCode` | `mainControllerCaptchaImage` |
| `fetchTenantList` | 需要检查是否有对应生成函数 |
| `fetchRegister` | `mainControllerRegister` |
| `fetchLogout` | `mainControllerLogout` |
| `fetchGetUserInfo` | `mainControllerGetInfo` |

#### 系统管理模块 (system)

| Legacy API | Generated API |
|------------|---------------|
| `fetchGetUserList` | `userControllerFindAll` |
| `fetchCreateUser` | `userControllerCreate` |
| `fetchUpdateUser` | `userControllerUpdate` |
| `fetchDeleteUser` | `userControllerRemove` |
| `fetchGetRoleList` | `roleControllerFindAll` |
| `fetchCreateRole` | `roleControllerCreate` |
| `fetchUpdateRole` | `roleControllerUpdate` |
| `fetchDeleteRole` | `roleControllerRemove` |
| `fetchGetMenuList` | `menuControllerFindAll` |
| `fetchCreateMenu` | `menuControllerCreate` |
| `fetchUpdateMenu` | `menuControllerUpdate` |
| `fetchDeleteMenu` | `menuControllerRemove` |
| `fetchGetDeptList` | `deptControllerFindAll` |
| `fetchCreateDept` | `deptControllerCreate` |
| `fetchUpdateDept` | `deptControllerUpdate` |
| `fetchDeleteDept` | `deptControllerRemove` |
| ... | ... |

#### 监控模块 (monitor)

| Legacy API | Generated API |
|------------|---------------|
| `fetchGetJobList` | `jobControllerList` |
| `fetchCreateJob` | `jobControllerAdd` |
| `fetchUpdateJob` | `jobControllerUpdate` |
| `fetchDeleteJob` | `jobControllerRemove` |
| `fetchGetJobLogList` | `jobLogControllerList` |
| `fetchGetOnlineUserList` | `onlineControllerFindAll` |
| `fetchGetOperLogList` | `operlogControllerFindAll` |
| `fetchGetLoginInforList` | `loginlogControllerFindAll` |
| `fetchGetMonitorCacheInfo` | `cacheControllerGetInfo` |
| `fetchGetServerInfo` | `serverControllerGetInfo` |
| ... | ... |

## 调用方式差异

### 旧 API 调用方式

```typescript
// 旧方式 - 直接传参
const result = await fetchGetUserList({ pageNum: 1, pageSize: 10 });
```

### 新 API 调用方式

```typescript
// 新方式 - 使用 options 对象
const result = await userControllerFindAll({
  query: { pageNum: 1, pageSize: 10 }
});
```

### 响应数据处理

旧 API 返回的是解构后的 data，新 API 返回的是完整响应对象，需要适配：

```typescript
// 旧方式
const { data } = await fetchGetUserList(params);

// 新方式 - 需要从响应中获取 data
const response = await userControllerFindAll({ query: params });
const data = response.data;
```

## Correctness Properties

### Property 1: 功能等价性

*For any* 迁移后的 API 调用，其功能应与迁移前完全等价，包括请求参数、响应数据和错误处理。

**Validates: Requirements 1-4**

### Property 2: 类型安全性

*For any* 迁移后的代码，应通过 TypeScript 类型检查，无类型错误。

**Validates: Requirements 1-4**

## Testing Strategy

1. **手动测试** - 每个模块迁移后，手动测试相关功能
2. **TypeScript 编译** - 确保迁移后代码通过类型检查
3. **功能回归** - 确保所有功能正常工作

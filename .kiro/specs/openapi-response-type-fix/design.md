# Design Document: OpenAPI Response Type Fix

## Overview

本设计文档描述如何修复 NestJS 后端项目中 OpenAPI 文档生成的问题。当前问题是：当 API 接口使用 `@Api()` 装饰器但没有显式指定 `type` 参数时，生成的 OpenAPI 文档中 `data` 字段默认显示为 `{ value: true }`，而不是实际的返回数据结构。

### 问题根源

在 `server/src/core/decorators/api.decorator.ts` 的 `buildDataSchema` 函数中：

```typescript
function buildDataSchema(type?: Type<any>, isArray?: boolean, isPager?: boolean) {
  // 无类型时返回简单成功标识
  if (!type) {
    return {
      type: 'object',
      properties: {
        value: {
          type: 'boolean',
          default: true,
        },
      },
      nullable: true,
    };
  }
  // ...
}
```

### 解决方案概述

1. 为每个缺失响应类型的接口创建对应的 VO 类
2. 更新所有 Controller 方法的 `@Api()` 装饰器，添加 `type` 参数
3. 修改 `buildDataSchema` 函数的默认行为，使用更通用的 schema
4. 确保所有 VO 类都有完整的 `@ApiProperty` 装饰器

## Architecture

```mermaid
graph TD
    A[Controller Method] --> B[@Api Decorator]
    B --> C{type 参数?}
    C -->|有| D[使用指定 VO 类型]
    C -->|无| E[使用默认 schema]
    
    D --> F[生成 OpenAPI Schema]
    E --> F
    
    G[VO 类] --> H[@ApiProperty 装饰器]
    H --> I[属性描述和示例]
    I --> F
```

## Components and Interfaces

### 1. 需要创建的 VO 类清单

根据代码分析，以下接口缺少响应类型定义，需要创建对应的 VO 类：

#### 1.1 Main 模块 (server/src/module/main/vo/)

| 接口 | 方法 | 需要的 VO 类 | 描述 |
|------|------|-------------|------|
| `/logout` | POST | `LogoutVo` | 退出登录响应 |
| `/register` | POST | `RegisterResultVo` | 注册结果响应 |
| `/registerUser` | GET | `RegisterEnabledVo` | 是否开启注册响应 |

#### 1.2 Auth 模块 (server/src/module/main/vo/auth.vo.ts)

| 接口 | 方法 | 需要的 VO 类 | 描述 |
|------|------|-------------|------|
| `/auth/register` | POST | `AuthRegisterResultVo` | 认证注册结果 |
| `/auth/logout` | POST | `AuthLogoutVo` | 认证退出响应 |
| `/auth/publicKey` | GET | `PublicKeyVo` | 公钥响应 |

#### 1.3 User 模块 (server/src/module/system/user/vo/)

| 接口 | 方法 | 需要的 VO 类 | 描述 |
|------|------|-------------|------|
| `/system/user/getInfo` | GET | `CurrentUserInfoVo` | 当前用户信息 |
| `/system/user/profile` (PUT) | PUT | `UpdateProfileResultVo` | 更新个人信息结果 |
| `/system/user/profile/updatePwd` | PUT | `UpdatePwdResultVo` | 修改密码结果 |
| `/system/user` (POST) | POST | `CreateUserResultVo` | 创建用户结果 |
| `/system/user/changeStatus` | PUT | `ChangeStatusResultVo` | 修改状态结果 |
| `/system/user` (PUT) | PUT | `UpdateUserResultVo` | 更新用户结果 |
| `/system/user/resetPwd` | PUT | `ResetPwdResultVo` | 重置密码结果 |
| `/system/user/:id` (DELETE) | DELETE | `DeleteUserResultVo` | 删除用户结果 |
| `/system/user/authRole` (PUT) | PUT | `UpdateAuthRoleResultVo` | 更新角色分配结果 |
| `/system/user/optionselect` | GET | `UserOptionSelectVo` | 用户选择框列表 |
| `/system/user/list/dept/:deptId` | GET | `DeptUserListVo` | 部门用户列表 |

#### 1.4 File Manager 模块 (server/src/module/system/file-manager/vo/)

需要为文件管理模块创建以下 VO 类：

| 接口 | 方法 | 需要的 VO 类 | 描述 |
|------|------|-------------|------|
| `/system/file-manager/folder` | POST | `CreateFolderVo` | 创建文件夹响应 |
| `/system/file-manager/folder` | PUT | `UpdateFolderVo` | 更新文件夹响应 |
| `/system/file-manager/folder/:folderId` | DELETE | `DeleteFolderVo` | 删除文件夹响应 |
| `/system/file-manager/folder/list` | GET | `FolderListVo` | 文件夹列表响应 |
| `/system/file-manager/folder/tree` | GET | `FolderTreeVo` | 文件夹树响应 |
| `/system/file-manager/file/list` | GET | `FileListVo` | 文件列表响应 |
| `/system/file-manager/file/move` | POST | `MoveFileVo` | 移动文件响应 |
| `/system/file-manager/file/rename` | POST | `RenameFileVo` | 重命名文件响应 |
| `/system/file-manager/file` | DELETE | `DeleteFileVo` | 删除文件响应 |
| `/system/file-manager/file/:uploadId` | GET | `FileDetailVo` | 文件详情响应 |
| `/system/file-manager/share` | POST | `CreateShareVo` | 创建分享响应 |
| `/system/file-manager/share/:shareId` | GET | `ShareInfoVo` | 分享信息响应 |
| `/system/file-manager/share/:shareId/download` | POST | `DownloadShareVo` | 下载分享响应 |
| `/system/file-manager/share/:shareId` | DELETE | `CancelShareVo` | 取消分享响应 |
| `/system/file-manager/share/my/list` | GET | `MyShareListVo` | 我的分享列表响应 |
| `/system/file-manager/recycle/list` | GET | `RecycleListVo` | 回收站列表响应 |
| `/system/file-manager/recycle/restore` | PUT | `RestoreFileVo` | 恢复文件响应 |
| `/system/file-manager/recycle/clear` | DELETE | `ClearRecycleVo` | 清空回收站响应 |
| `/system/file-manager/file/:uploadId/versions` | GET | `FileVersionsVo` | 文件版本历史响应 |
| `/system/file-manager/file/restore-version` | POST | `RestoreVersionVo` | 恢复版本响应 |
| `/system/file-manager/file/:uploadId/access-token` | GET | `AccessTokenVo` | 访问令牌响应 |
| `/system/file-manager/storage/stats` | GET | `StorageStatsVo` | 存储统计响应 |

#### 1.5 Dept 模块 (server/src/module/system/dept/vo/)

| 接口 | 方法 | 需要的 VO 类 | 描述 |
|------|------|-------------|------|
| `/system/dept` | POST | `CreateDeptResultVo` | 创建部门结果 |
| `/system/dept` | PUT | `UpdateDeptResultVo` | 更新部门结果 |
| `/system/dept/:id` | DELETE | `DeleteDeptResultVo` | 删除部门结果 |

#### 1.6 Role 模块 (server/src/module/system/role/vo/)

| 接口 | 方法 | 需要的 VO 类 | 描述 |
|------|------|-------------|------|
| `/system/role` | POST | `CreateRoleResultVo` | 创建角色结果 |
| `/system/role` | PUT | `UpdateRoleResultVo` | 更新角色结果 |
| `/system/role/dataScope` | PUT | `DataScopeResultVo` | 数据权限修改结果 |
| `/system/role/changeStatus` | PUT | `ChangeRoleStatusResultVo` | 修改状态结果 |
| `/system/role/:id` | DELETE | `DeleteRoleResultVo` | 删除角色结果 |
| `/system/role/authUser/cancel` | PUT | `AuthUserCancelResultVo` | 解绑用户结果 |
| `/system/role/authUser/cancelAll` | PUT | `AuthUserCancelAllResultVo` | 批量解绑结果 |
| `/system/role/authUser/selectAll` | PUT | `AuthUserSelectAllResultVo` | 批量绑定结果 |

### 2. VO 类设计规范

每个 VO 类必须遵循以下规范：

```typescript
import { ApiProperty } from '@nestjs/swagger';

/**
 * [功能描述] 响应
 */
export class XxxVo {
  @ApiProperty({ 
    description: '属性描述',
    example: '示例值',
    required: true  // 或 false
  })
  propertyName: PropertyType;
}
```

### 3. 通用响应 VO 类

创建 `server/src/shared/vo/common.vo.ts`：

```typescript
import { ApiProperty } from '@nestjs/swagger';

/**
 * 操作成功响应（无具体数据）
 */
export class SuccessVo {
  @ApiProperty({ description: '操作是否成功', example: true })
  success: boolean;
}

/**
 * 布尔值响应
 */
export class BooleanResultVo {
  @ApiProperty({ description: '结果值', example: true })
  value: boolean;
}

/**
 * 删除操作响应
 */
export class DeleteResultVo {
  @ApiProperty({ description: '删除的记录数', example: 1 })
  affected: number;
}

/**
 * 创建操作响应
 */
export class CreateResultVo {
  @ApiProperty({ description: '创建的记录ID', example: 1 })
  id: number;
}
```

## Data Models

### VO 类详细设计

#### Main 模块 VO 类

```typescript
// server/src/module/main/vo/main.vo.ts (新增)

/**
 * 退出登录响应
 */
export class LogoutVo {
  @ApiProperty({ description: '退出是否成功', example: true })
  success: boolean;
}

/**
 * 注册结果响应
 */
export class RegisterResultVo {
  @ApiProperty({ description: '注册是否成功', example: true })
  success: boolean;
  
  @ApiProperty({ description: '提示消息', example: '注册成功' })
  message: string;
}

/**
 * 是否开启注册响应
 */
export class RegisterEnabledVo {
  @ApiProperty({ description: '是否开启用户注册', example: true })
  enabled: boolean;
}
```

#### Auth 模块 VO 类

```typescript
// server/src/module/main/vo/auth.vo.ts (新增)

/**
 * 公钥响应
 */
export class PublicKeyVo {
  @ApiProperty({ description: 'RSA公钥', example: '-----BEGIN PUBLIC KEY-----...' })
  publicKey: string;
}
```

#### User 模块 VO 类

```typescript
// server/src/module/system/user/vo/user.vo.ts (新增)

/**
 * 当前用户信息响应
 */
export class CurrentUserInfoVo {
  @ApiProperty({ description: '用户信息', type: UserProfileVo })
  user: UserProfileVo;
  
  @ApiProperty({ description: '角色列表', type: [String], example: ['admin'] })
  roles: string[];
  
  @ApiProperty({ description: '权限列表', type: [String], example: ['system:user:list'] })
  permissions: string[];
}

/**
 * 用户选择框选项
 */
export class UserOptionVo {
  @ApiProperty({ description: '用户ID', example: 1 })
  userId: number;
  
  @ApiProperty({ description: '用户名', example: 'admin' })
  userName: string;
  
  @ApiProperty({ description: '昵称', example: '管理员' })
  nickName: string;
}

/**
 * 用户选择框列表响应
 */
export class UserOptionSelectVo {
  @ApiProperty({ description: '用户选项列表', type: [UserOptionVo] })
  list: UserOptionVo[];
}
```

### OpenAPI Schema 映射

| 场景 | Api 装饰器配置 | 生成的 data schema |
|------|---------------|-------------------|
| 有明确类型 | `type: UserVo` | `{ $ref: '#/components/schemas/UserVo' }` |
| 数组类型 | `type: UserVo, isArray: true` | `{ type: 'array', items: { $ref: '...' } }` |
| 分页类型 | `type: UserVo, isArray: true, isPager: true` | `{ rows: [...], total: number }` |
| 未指定（默认） | 无 type 参数 | `{ type: 'object', additionalProperties: true }` |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: buildDataSchema 输出正确性

*For any* 调用 `buildDataSchema` 函数的场景：
- 当 `voidResponse` 为 `true` 时，返回的 schema 必须包含 `type: 'null'` 和 `nullable: true`
- 当 `primitiveType` 为 `'boolean'`、`'string'` 或 `'number'` 时，返回的 schema 的 `type` 必须与 `primitiveType` 相同
- 当 `type` 参数存在且为非基础类型时，返回的 schema 必须包含 `$ref` 引用

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 2: OpenAPI 文档完整性

*For any* 生成的 OpenAPI 文档中的 API 端点，如果该端点的 Controller 方法使用了 `@Api()` 装饰器并指定了 `type`、`voidResponse` 或 `primitiveType` 参数，则生成的响应 schema 不应包含默认的 `{ value: true }` 结构。

**Validates: Requirements 5.1**

### Property 3: VO 类属性完整性

*For any* 定义在 `vo/` 目录下的 VO 类，其所有公开属性都必须使用 `@ApiProperty()` 装饰器，且装饰器必须包含 `description` 属性。

**Validates: Requirements 2.3**

### Property 4: OpenAPI Schema 与实际响应匹配

*For any* API 端点，其 OpenAPI 文档中定义的响应 schema 结构必须与实际 API 调用返回的数据结构一致（字段名称和类型匹配）。

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

## Error Handling

### 编译时检查

- TypeScript 类型检查确保 `primitiveType` 只能是 `'boolean' | 'string' | 'number'`
- 如果同时指定 `type` 和 `voidResponse`，应优先使用 `type`（向后兼容）

### 运行时行为

- 如果 `buildDataSchema` 接收到无效参数组合，应回退到默认行为并记录警告日志

## Testing Strategy

### 单元测试

1. **buildDataSchema 函数测试**
   - 测试 `voidResponse: true` 场景
   - 测试各种 `primitiveType` 值
   - 测试 `type` 参数与基础类型的组合
   - 测试参数优先级（type > primitiveType > voidResponse > default）

2. **Api 装饰器测试**
   - 测试新增选项的正确传递
   - 测试生成的装饰器元数据

### 属性测试

使用 Jest 和 fast-check 进行属性测试：

1. **Property 1 测试**: 生成随机的 buildDataSchema 参数组合，验证输出 schema 符合预期规则
2. **Property 2 测试**: 解析生成的 OpenAPI JSON，验证没有意外的 `{ value: true }` 默认 schema
3. **Property 3 测试**: 扫描所有 VO 类文件，验证 @ApiProperty 装饰器的存在和完整性

### 集成测试

1. 启动应用并生成 OpenAPI 文档
2. 验证关键端点的响应 schema 正确性
3. 使用 OpenAPI 验证工具检查文档合规性

### 测试配置

- 属性测试最少运行 100 次迭代
- 使用 `fast-check` 作为属性测试库

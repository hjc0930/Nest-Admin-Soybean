# Requirements Document

## Introduction

本功能旨在将前端项目完全迁移到使用 `@hey-api/openapi-ts` 自动生成的 API 代码。当前项目已经配置了 OpenAPI 代码生成工具，并在 `src/service/api-gen` 目录下生成了完整的 API SDK。迁移后将删除所有手写 API，前端页面的函数名称和字段将与后端接口定义完全一致，实现类型安全和自动同步。

## Glossary

- **Generated_API**: 由 `@hey-api/openapi-ts` 根据 OpenAPI 规范自动生成的 API 函数和类型定义，位于 `src/service/api-gen` 目录
- **Manual_API**: 开发者手动编写的 API 调用函数，位于 `src/service/api` 目录（将被删除）
- **API_Client**: 生成的 API 使用的 HTTP 客户端，负责发送请求和处理响应
- **Request_Interceptor**: 请求拦截器，用于在请求发送前添加认证信息、加密等处理
- **Response_Transformer**: 响应转换器，用于将后端响应转换为前端期望的数据格式
- **OpenAPI_Spec**: 后端服务的 OpenAPI 规范文件（`server/public/openApi.json`）
- **DTO**: Data Transfer Object，后端定义的数据传输对象类型

## Requirements

### Requirement 1: 配置生成的 API 客户端使用现有请求层

**User Story:** 作为开发者，我希望生成的 API 能够使用现有的请求拦截器和响应处理逻辑，以便保持认证、加密、错误处理等功能的一致性。

#### Acceptance Criteria

1. WHEN Generated_API 发送请求 THEN API_Client SHALL 自动添加认证 Token 到请求头
2. WHEN Generated_API 发送请求 THEN API_Client SHALL 自动添加 ClientId 和 Content-Language 到请求头
3. WHEN 请求需要加密 THEN API_Client SHALL 使用 AES+RSA 混合加密方式加密请求数据
4. WHEN 请求需要防重复提交 THEN API_Client SHALL 检测并阻止短时间内的重复请求
5. WHEN 后端返回登出错误码 THEN API_Client SHALL 自动执行登出并跳转到登录页
6. WHEN 后端返回 Token 过期错误码 THEN API_Client SHALL 自动刷新 Token 并重试请求
7. WHEN 请求失败 THEN API_Client SHALL 显示统一的错误提示消息

### Requirement 2: 删除手写 API 并完全使用生成的 API

**User Story:** 作为开发者，我希望删除所有手写的 API 代码，完全使用生成的 API，以便消除重复代码和维护成本。

#### Acceptance Criteria

1. THE System SHALL 删除 `src/service/api` 目录下的所有手写 API 文件
2. THE System SHALL 从 `src/service/api-gen` 导出所有生成的 API 函数
3. WHEN 前端调用 API THEN System SHALL 直接使用生成的函数名（如 `authControllerLoginV1`）
4. THE System SHALL 保留 `src/service/request` 目录下的请求配置和拦截器逻辑

### Requirement 3: 前端页面使用与接口定义一致的函数名和字段

**User Story:** 作为开发者，我希望前端页面的 API 调用函数名和数据字段与后端接口定义完全一致，以便提高代码可读性和类型安全。

#### Acceptance Criteria

1. WHEN 前端调用登录 API THEN System SHALL 使用 `authControllerLoginV1` 函数名
2. WHEN 前端调用获取用户信息 API THEN System SHALL 使用 `userControllerGetInfoV1` 函数名
3. WHEN 前端使用请求参数 THEN System SHALL 使用生成的 DTO 类型定义的字段名
4. WHEN 前端使用响应数据 THEN System SHALL 使用生成的响应类型定义的字段名
5. THE System SHALL 更新所有使用旧 API 的组件以使用新的函数名和字段名

### Requirement 4: 更新认证模块使用生成的 API

**User Story:** 作为开发者，我希望认证模块使用生成的 API，以便获得完整的类型安全。

#### Acceptance Criteria

1. WHEN 用户获取租户列表 THEN System SHALL 调用 `authControllerGetTenantListV1`
2. WHEN 用户获取验证码 THEN System SHALL 调用 `authControllerGetCaptchaCodeV1`
3. WHEN 用户登录 THEN System SHALL 调用 `authControllerLoginV1` 并使用 `AuthLoginRequestDto` 类型
4. WHEN 用户注册 THEN System SHALL 调用 `authControllerRegisterV1` 并使用 `AuthRegisterRequestDto` 类型
5. WHEN 用户登出 THEN System SHALL 调用 `authControllerLogoutV1`
6. WHEN 获取当前用户信息 THEN System SHALL 调用 `userControllerGetInfoV1`

### Requirement 5: 更新系统管理模块使用生成的 API

**User Story:** 作为开发者，我希望系统管理模块使用生成的 API，以便减少手动维护成本。

#### Acceptance Criteria

1. WHEN 操作菜单管理 THEN System SHALL 使用 `menuController*V1` 系列函数
2. WHEN 操作字典管理 THEN System SHALL 使用 `dictController*V1` 系列函数
3. WHEN 操作部门管理 THEN System SHALL 使用 `deptController*V1` 系列函数
4. WHEN 操作角色管理 THEN System SHALL 使用 `roleController*V1` 系列函数
5. WHEN 操作岗位管理 THEN System SHALL 使用 `postController*V1` 系列函数
6. WHEN 操作用户管理 THEN System SHALL 使用 `userController*V1` 系列函数

### Requirement 6: 保持响应数据处理逻辑

**User Story:** 作为开发者，我希望响应数据的处理逻辑保持不变，以便业务代码能够正常工作。

#### Acceptance Criteria

1. WHEN Generated_API 返回成功响应 THEN Response_Transformer SHALL 提取 `data` 字段作为返回值
2. WHEN Generated_API 返回分页数据 THEN Response_Transformer SHALL 保留 `rows` 和分页信息
3. WHEN Generated_API 返回二进制数据 THEN Response_Transformer SHALL 直接返回原始数据
4. WHEN Generated_API 返回错误 THEN System SHALL 抛出异常以便调用方使用 try-catch 处理

### Requirement 7: 提供统一的类型定义导出

**User Story:** 作为开发者，我希望能够方便地导入生成的类型定义，以便在组件中使用类型安全的数据结构。

#### Acceptance Criteria

1. THE System SHALL 从 `src/service/api-gen` 导出所有生成的 API 函数
2. THE System SHALL 从 `src/service/api-gen` 导出所有生成的请求/响应类型定义
3. WHEN 开发者导入 API 函数 THEN System SHALL 提供完整的 TypeScript 类型提示
4. WHEN 开发者导入类型定义 THEN System SHALL 提供与后端 DTO 一致的类型结构

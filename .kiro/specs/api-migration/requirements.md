# Requirements Document

## Introduction

本功能旨在将前端项目中所有使用手写 API 的页面迁移到使用自动生成的 API 客户端。通过统一使用 `@/service/api-gen` 中生成的 API 函数，提高代码一致性和类型安全性。

## Glossary

- **Legacy_API**: 现有的手写 API 定义，位于 `@/service/api` 目录
- **Generated_API**: 使用 @hey-api/openapi-ts 生成的 API 客户端，位于 `@/service/api-gen` 目录
- **Migration**: 将页面中的 Legacy_API 调用替换为 Generated_API 调用的过程

## Requirements

### Requirement 1: 认证模块迁移

**User Story:** As a developer, I want to migrate authentication-related API calls, so that login and user info retrieval use the generated API.

#### Acceptance Criteria

1. WHEN migrating auth module, THE Migration SHALL replace `fetchLogin` with `mainControllerLogin`
2. WHEN migrating auth module, THE Migration SHALL replace `fetchCaptchaCode` with `mainControllerCaptchaImage`
3. WHEN migrating auth module, THE Migration SHALL replace `fetchTenantList` with corresponding generated function
4. WHEN migrating auth module, THE Migration SHALL replace `fetchRegister` with `mainControllerRegister`
5. WHEN migrating auth module, THE Migration SHALL ensure all authentication flows work correctly after migration

### Requirement 2: 系统管理模块迁移

**User Story:** As a developer, I want to migrate system management API calls, so that user, role, menu, dept, and other system modules use the generated API.

#### Acceptance Criteria

1. WHEN migrating system module, THE Migration SHALL replace all user-related API calls with generated functions
2. WHEN migrating system module, THE Migration SHALL replace all role-related API calls with generated functions
3. WHEN migrating system module, THE Migration SHALL replace all menu-related API calls with generated functions
4. WHEN migrating system module, THE Migration SHALL replace all dept-related API calls with generated functions
5. WHEN migrating system module, THE Migration SHALL replace all dict-related API calls with generated functions
6. WHEN migrating system module, THE Migration SHALL replace all config-related API calls with generated functions
7. WHEN migrating system module, THE Migration SHALL replace all notice-related API calls with generated functions
8. WHEN migrating system module, THE Migration SHALL replace all post-related API calls with generated functions
9. WHEN migrating system module, THE Migration SHALL replace all tenant-related API calls with generated functions

### Requirement 3: 监控模块迁移

**User Story:** As a developer, I want to migrate monitoring API calls, so that job, log, cache, and server modules use the generated API.

#### Acceptance Criteria

1. WHEN migrating monitor module, THE Migration SHALL replace all job-related API calls with generated functions
2. WHEN migrating monitor module, THE Migration SHALL replace all job-log-related API calls with generated functions
3. WHEN migrating monitor module, THE Migration SHALL replace all login-infor-related API calls with generated functions
4. WHEN migrating monitor module, THE Migration SHALL replace all oper-log-related API calls with generated functions
5. WHEN migrating monitor module, THE Migration SHALL replace all online-related API calls with generated functions
6. WHEN migrating monitor module, THE Migration SHALL replace all cache-related API calls with generated functions
7. WHEN migrating monitor module, THE Migration SHALL replace all server-related API calls with generated functions

### Requirement 4: 工具模块迁移

**User Story:** As a developer, I want to migrate tool API calls, so that code generation module uses the generated API.

#### Acceptance Criteria

1. WHEN migrating tool module, THE Migration SHALL replace all gen-related API calls with generated functions

### Requirement 5: 清理旧代码

**User Story:** As a developer, I want to remove legacy API files after migration, so that the codebase is clean and maintainable.

#### Acceptance Criteria

1. WHEN migration is complete, THE Migration SHALL remove or deprecate the `@/service/api` directory
2. WHEN migration is complete, THE Migration SHALL update all import paths to use `@/service/api-gen`
3. WHEN migration is complete, THE Migration SHALL ensure no references to legacy API remain

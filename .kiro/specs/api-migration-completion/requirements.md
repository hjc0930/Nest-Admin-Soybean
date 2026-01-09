# Requirements Document

## Introduction

本功能旨在将前端项目中所有页面直接使用 `@/service/api-gen` 中自动生成的 API 函数，删除旧的手写 API 文件（`@/service/api` 目录），实现统一的类型安全 API 调用。

## Glossary

- **Generated_API**: 使用 @hey-api/openapi-ts 从 OpenAPI 规范生成的 API 客户端，位于 `@/service/api-gen` 目录
- **Page**: 前端 Vue 页面组件
- **Component**: 可复用的 Vue 组件

## Requirements

### Requirement 1: 认证相关页面使用生成 API

**User Story:** As a developer, I want authentication pages to use generated API, so that login and registration have type-safe API calls.

#### Acceptance Criteria

1. WHEN pwd-login.vue calls API, THE Page SHALL use Generated_API functions directly
2. WHEN register.vue calls API, THE Page SHALL use Generated_API functions directly
3. WHEN social-callback/index.vue calls API, THE Page SHALL use Generated_API functions directly
4. WHEN route/index.ts fetches routes, THE Store SHALL use Generated_API functions directly

### Requirement 2: 用户中心页面使用生成 API

**User Story:** As a developer, I want user center pages to use generated API, so that profile operations have type-safe API calls.

#### Acceptance Criteria

1. WHEN user-center/index.vue calls API, THE Page SHALL use Generated_API functions directly
2. WHEN user-avatar.vue uploads avatar, THE Component SHALL use Generated_API functions directly
3. WHEN social-card.vue manages social bindings, THE Component SHALL use Generated_API functions directly

### Requirement 3: 系统管理页面使用生成 API

**User Story:** As a developer, I want system management pages to use generated API, so that all CRUD operations have type-safe API calls.

#### Acceptance Criteria

1. WHEN user management pages call API, THE Pages SHALL use Generated_API functions directly
2. WHEN menu management pages call API, THE Pages SHALL use Generated_API functions directly
3. WHEN role management pages call API, THE Pages SHALL use Generated_API functions directly
4. WHEN dict management pages call API, THE Pages SHALL use Generated_API functions directly

### Requirement 4: 公共组件使用生成 API

**User Story:** As a developer, I want shared components to use generated API, so that reusable components have type-safe API calls.

#### Acceptance Criteria

1. WHEN tenant-select.vue fetches data, THE Component SHALL use Generated_API functions directly
2. WHEN post-select.vue fetches data, THE Component SHALL use Generated_API functions directly
3. WHEN user-select.vue fetches data, THE Component SHALL use Generated_API functions directly
4. WHEN menu-tree-select.vue fetches data, THE Component SHALL use Generated_API functions directly
5. WHEN role-select.vue fetches data, THE Component SHALL use Generated_API functions directly
6. WHEN dept-tree-select.vue fetches data, THE Component SHALL use Generated_API functions directly

### Requirement 5: 业务 Hook 使用生成 API

**User Story:** As a developer, I want business hooks to use generated API, so that data fetching logic has type-safe API calls.

#### Acceptance Criteria

1. WHEN dict.ts hook fetches dictionary data, THE Hook SHALL use Generated_API functions directly

### Requirement 6: 文件管理模块使用生成 API

**User Story:** As a developer, I want file manager module to use generated API, so that file operations have type-safe API calls.

#### Acceptance Criteria

1. WHEN file-manager pages call API, THE Pages SHALL use Generated_API functions directly
2. WHEN file operation modals call API, THE Components SHALL use Generated_API functions directly

### Requirement 7: 删除旧 API 文件

**User Story:** As a developer, I want to remove legacy API files, so that the codebase is clean without duplicate code.

#### Acceptance Criteria

1. WHEN migration is complete, THE System SHALL have no imports from `@/service/api`
2. WHEN migration is complete, THE System SHALL delete the `@/service/api` directory
3. WHEN migration is complete, THE System SHALL pass TypeScript type checking


# Requirements Document

## Introduction

本规范定义了对 Nest-Admin-Soybean 项目所有 API 接口返回格式和功能进行系统性验证的需求。目标是确保所有接口遵循统一的响应格式规范，分页功能正常，错误处理一致。

## Glossary

- **API_Response**: 所有 API 接口返回的统一响应结构，包含 code、msg、data 字段
- **Pagination_Response**: 分页接口返回的数据结构，包含 rows、total、pageNum、pageSize、pages 字段
- **Result_Class**: 项目中用于构建统一响应的工具类
- **ResponseCode**: 响应码枚举，定义了所有业务错误码
- **Test_Suite**: 用于验证 API 接口的测试集合

## Requirements

### Requirement 1: 统一响应格式验证

**User Story:** As a 开发者, I want 所有 API 接口返回统一的响应格式, so that 前端可以统一处理响应数据。

#### Acceptance Criteria

1. THE API_Response SHALL contain a `code` field of type number
2. THE API_Response SHALL contain a `msg` field of type string
3. THE API_Response SHALL contain a `data` field (can be null)
4. WHEN an API request succeeds, THE API_Response SHALL return code 200
5. WHEN an API request fails due to business logic, THE API_Response SHALL return a non-200 code with descriptive msg

### Requirement 2: 分页响应格式验证

**User Story:** As a 开发者, I want 所有分页接口返回统一的分页格式, so that 前端可以统一处理分页数据。

#### Acceptance Criteria

1. WHEN a paginated API is called, THE Pagination_Response SHALL contain a `rows` field of type array
2. WHEN a paginated API is called, THE Pagination_Response SHALL contain a `total` field of type number
3. WHEN a paginated API is called, THE Pagination_Response SHALL contain `pageNum` and `pageSize` fields
4. WHEN a paginated API is called, THE Pagination_Response SHALL contain a `pages` field representing total pages
5. THE rows array length SHALL NOT exceed the requested pageSize

### Requirement 3: Result 类功能验证

**User Story:** As a 开发者, I want Result 类的所有方法正常工作, so that 可以正确构建响应数据。

#### Acceptance Criteria

1. WHEN Result.ok() is called, THE Result_Class SHALL return code 200 with provided data
2. WHEN Result.fail() is called, THE Result_Class SHALL return the specified error code and message
3. WHEN Result.page() is called, THE Result_Class SHALL return properly formatted pagination data
4. WHEN Result.when() is called with true condition, THE Result_Class SHALL return success response
5. WHEN Result.when() is called with false condition, THE Result_Class SHALL return failure response
6. WHEN Result.fromPromise() is called with resolved promise, THE Result_Class SHALL return success response
7. WHEN Result.fromPromise() is called with rejected promise, THE Result_Class SHALL return failure response

### Requirement 4: 错误码一致性验证

**User Story:** As a 开发者, I want 所有错误响应使用正确的错误码, so that 前端可以根据错误码进行相应处理。

#### Acceptance Criteria

1. WHEN a resource is not found, THE API_Response SHALL return code in range 1002 or 3001-3999
2. WHEN authentication fails, THE API_Response SHALL return code in range 2001-2008
3. WHEN validation fails, THE API_Response SHALL return code 1001 (PARAM_INVALID)
4. WHEN a business operation fails, THE API_Response SHALL return code in range 1000-1999
5. THE ResponseCode enum SHALL have corresponding message in ResponseMessage map

### Requirement 5: 认证接口验证

**User Story:** As a 用户, I want 认证相关接口正常工作, so that 可以正常登录和获取用户信息。

#### Acceptance Criteria

1. WHEN valid credentials are provided to login, THE Auth_API SHALL return a valid token
2. WHEN invalid credentials are provided to login, THE Auth_API SHALL return appropriate error code
3. WHEN a valid token is used, THE Auth_API SHALL return user information
4. WHEN an invalid or expired token is used, THE Auth_API SHALL return code 2001 or 2002
5. WHEN logout is called, THE Auth_API SHALL invalidate the token

### Requirement 6: CRUD 接口验证

**User Story:** As a 开发者, I want 所有 CRUD 接口正常工作, so that 可以正确进行数据操作。

#### Acceptance Criteria

1. WHEN a list API is called, THE CRUD_API SHALL return paginated data
2. WHEN a get-by-id API is called with valid ID, THE CRUD_API SHALL return the resource
3. WHEN a get-by-id API is called with invalid ID, THE CRUD_API SHALL return appropriate error
4. WHEN a create API is called with valid data, THE CRUD_API SHALL create and return the resource
5. WHEN an update API is called with valid data, THE CRUD_API SHALL update and return the resource
6. WHEN a delete API is called with valid ID, THE CRUD_API SHALL delete the resource

### Requirement 7: 测试文件组织规范

**User Story:** As a 开发者, I want 所有测试文件统一放在 test 目录下, so that 测试代码组织清晰。

#### Acceptance Criteria

1. THE Test_Suite SHALL be located in `server/test/` directory
2. THE unit tests SHALL be located in `server/test/unit/` directory
3. THE E2E tests SHALL be located in `server/test/e2e/` directory
4. THE property-based tests SHALL use `.pbt.spec.ts` or `.pbt.e2e-spec.ts` suffix
5. THE test fixtures SHALL be located in `server/test/fixtures/` directory

### Requirement 8: 测试覆盖率要求

**User Story:** As a 开发者, I want 测试覆盖率达到 90%, so that 代码质量得到保证。

#### Acceptance Criteria

1. THE Test_Suite SHALL achieve at least 90% line coverage
2. THE Test_Suite SHALL achieve at least 90% branch coverage
3. THE Test_Suite SHALL achieve at least 90% function coverage
4. THE Test_Suite SHALL achieve at least 90% statement coverage
5. WHEN coverage drops below 90%, THE CI pipeline SHALL fail

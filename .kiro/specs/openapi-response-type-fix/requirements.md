# Requirements Document

## Introduction

修复 NestJS 后端项目中 OpenAPI 文档生成的问题：当 API 接口没有显式指定响应类型时，生成的 OpenAPI 文档中 `data` 字段默认显示为 `{ value: true }`，而不是实际的返回数据结构。这导致前端代码生成工具无法正确生成类型定义。

## Glossary

- **Api_Decorator**: 统一 API 装饰器，用于生成 OpenAPI 文档的元数据
- **OpenAPI_Document**: 符合 OpenAPI 3.0 规范的 JSON 文档，描述 API 接口
- **Response_Type**: API 接口返回的数据类型定义
- **VO_Class**: View Object 类，用于定义 API 响应数据结构
- **buildDataSchema**: Api_Decorator 中用于构建响应 data 字段 schema 的函数

## Requirements

### Requirement 1: 识别缺失响应类型的接口

**User Story:** As a developer, I want to identify all API endpoints that are missing explicit response type definitions, so that I can ensure complete OpenAPI documentation.

#### Acceptance Criteria

1. WHEN an API endpoint uses the Api_Decorator without a `type` parameter, THE System SHALL identify it as needing a response type definition
2. WHEN reviewing the codebase, THE System SHALL list all Controller methods that return data but lack explicit type definitions

### Requirement 2: 为缺失类型的接口创建 VO 类

**User Story:** As a developer, I want to create appropriate VO classes for API responses, so that the OpenAPI documentation accurately reflects the actual response structure.

#### Acceptance Criteria

1. WHEN an API endpoint returns a boolean value, THE System SHALL define a VO class with a boolean property
2. WHEN an API endpoint returns a simple success indicator, THE System SHALL use an appropriate type annotation (e.g., `Boolean` type)
3. THE VO_Class SHALL include proper `@ApiProperty` decorators with descriptions and examples

### Requirement 3: 更新 Api 装饰器的默认行为

**User Story:** As a developer, I want the Api decorator to handle missing types more gracefully, so that the OpenAPI documentation is more accurate.

#### Acceptance Criteria

1. WHEN the Api_Decorator is used without a `type` parameter and the method returns `void` or `null`, THE buildDataSchema function SHALL return `{ type: 'null', nullable: true }`
2. WHEN the Api_Decorator is used without a `type` parameter and the method returns a boolean, THE buildDataSchema function SHALL return `{ type: 'boolean' }`
3. THE Api_Decorator SHALL support a new `voidResponse` option to explicitly indicate no data is returned

### Requirement 4: 更新现有 Controller 方法

**User Story:** As a developer, I want all existing API endpoints to have proper response type definitions, so that the generated OpenAPI document is complete and accurate.

#### Acceptance Criteria

1. WHEN the `logout` endpoint is called, THE OpenAPI_Document SHALL show the correct response type (boolean or void)
2. WHEN the `register` endpoint is called, THE OpenAPI_Document SHALL show the correct response type
3. WHEN the `registerUser` endpoint is called, THE OpenAPI_Document SHALL show `data` as `boolean` type
4. FOR ALL API endpoints in the system, THE OpenAPI_Document SHALL accurately reflect the actual response data structure

### Requirement 5: 验证 OpenAPI 文档正确性

**User Story:** As a developer, I want to verify that the generated OpenAPI document correctly reflects all response types, so that frontend code generation works properly.

#### Acceptance Criteria

1. WHEN the OpenAPI document is generated, THE System SHALL not contain any `{ value: true }` default schemas for endpoints with actual return values
2. WHEN the OpenAPI document is used with code generation tools, THE generated types SHALL match the actual API responses

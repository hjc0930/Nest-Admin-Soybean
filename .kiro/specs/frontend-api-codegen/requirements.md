# Requirements Document

## Introduction

本功能旨在为前端项目实现基于 OpenAPI 规范的 API 代码自动生成能力。通过读取后端 NestJS 服务生成的 `openApi.json` 文件，自动生成类型安全的 TypeScript API 调用函数和类型定义，替代当前手写 API 定义的方式，提高开发效率并确保前后端接口的一致性。

## Glossary

- **OpenAPI_Spec**: 后端服务生成的 OpenAPI 3.0 规范文件 (`server/openApi.json`)
- **Code_Generator**: 基于 OpenAPI 规范生成 TypeScript 代码的工具
- **API_Client**: 生成的 TypeScript API 调用函数集合
- **Type_Definition**: 从 OpenAPI schemas 生成的 TypeScript 类型定义
- **Request_Wrapper**: 现有的 `@/service/request` 封装，用于发起 HTTP 请求

## Requirements

### Requirement 1: OpenAPI 规范解析

**User Story:** As a developer, I want the system to parse the OpenAPI specification file, so that I can generate accurate API client code.

#### Acceptance Criteria

1. WHEN the Code_Generator reads the OpenAPI_Spec file, THE Code_Generator SHALL parse all paths, methods, parameters, and schemas
2. WHEN the OpenAPI_Spec contains `$ref` references, THE Code_Generator SHALL resolve all references to their actual definitions
3. IF the OpenAPI_Spec file is invalid or malformed, THEN THE Code_Generator SHALL report a descriptive error message
4. WHEN parsing operation definitions, THE Code_Generator SHALL extract operationId, summary, tags, parameters, requestBody, and responses

### Requirement 2: TypeScript 类型生成

**User Story:** As a developer, I want TypeScript types generated from OpenAPI schemas, so that I can have type-safe API interactions.

#### Acceptance Criteria

1. WHEN the Code_Generator processes OpenAPI schemas, THE Code_Generator SHALL generate corresponding TypeScript interfaces
2. WHEN a schema contains nested objects, THE Code_Generator SHALL generate nested TypeScript interfaces with proper naming
3. WHEN a schema property is marked as required, THE Type_Definition SHALL mark the property as non-optional
4. WHEN a schema property is not required, THE Type_Definition SHALL mark the property as optional using `?` syntax
5. WHEN a schema uses `enum` values, THE Type_Definition SHALL generate TypeScript union types or enums
6. WHEN a schema uses `allOf`, `oneOf`, or `anyOf`, THE Type_Definition SHALL generate appropriate TypeScript intersection or union types

### Requirement 3: API 函数生成

**User Story:** As a developer, I want API functions generated that match the existing code style, so that I can seamlessly integrate generated code with the existing codebase.

#### Acceptance Criteria

1. WHEN the Code_Generator generates API functions, THE API_Client SHALL use the existing Request_Wrapper (`request` from `@/service/request`)
2. WHEN generating function names, THE Code_Generator SHALL derive names from operationId using camelCase convention
3. WHEN an endpoint has path parameters, THE API_Client function SHALL accept them as function parameters
4. WHEN an endpoint has query parameters, THE API_Client function SHALL accept them as an optional params object
5. WHEN an endpoint has a request body, THE API_Client function SHALL accept it as a typed data parameter
6. WHEN an endpoint has a response schema, THE API_Client function SHALL return a properly typed Promise
7. WHEN generating API functions, THE Code_Generator SHALL group functions by OpenAPI tags into separate files

### Requirement 4: 文件组织与输出

**User Story:** As a developer, I want generated files organized in a predictable structure, so that I can easily locate and use the generated code.

#### Acceptance Criteria

1. WHEN the Code_Generator outputs files, THE Code_Generator SHALL create files in a configurable output directory
2. WHEN generating type definitions, THE Code_Generator SHALL output them to a dedicated types file
3. WHEN generating API functions, THE Code_Generator SHALL organize them by tag into separate module files
4. WHEN generating files, THE Code_Generator SHALL create an index file that re-exports all generated modules
5. WHEN a file already exists in the output directory, THE Code_Generator SHALL overwrite it with the new generated content

### Requirement 5: 代码生成配置

**User Story:** As a developer, I want to configure the code generation process, so that I can customize the output to match project conventions.

#### Acceptance Criteria

1. THE Code_Generator SHALL support configuration via a JSON or TypeScript configuration file
2. WHEN configured, THE Code_Generator SHALL allow specifying the OpenAPI_Spec file path
3. WHEN configured, THE Code_Generator SHALL allow specifying the output directory path
4. WHEN configured, THE Code_Generator SHALL allow customizing the request import path
5. WHEN configured, THE Code_Generator SHALL allow filtering which tags or endpoints to generate

### Requirement 6: 命令行集成

**User Story:** As a developer, I want to run code generation via npm scripts, so that I can easily regenerate API code when the backend changes.

#### Acceptance Criteria

1. THE Code_Generator SHALL be executable via an npm script command
2. WHEN executed, THE Code_Generator SHALL read configuration from the project root
3. WHEN generation completes successfully, THE Code_Generator SHALL output a summary of generated files
4. IF generation fails, THEN THE Code_Generator SHALL exit with a non-zero status code and error message

### Requirement 7: 生成代码质量

**User Story:** As a developer, I want generated code to be clean and maintainable, so that I can review and understand it when needed.

#### Acceptance Criteria

1. WHEN generating code, THE Code_Generator SHALL include JSDoc comments derived from OpenAPI summaries and descriptions
2. WHEN generating code, THE Code_Generator SHALL format output using consistent indentation and style
3. WHEN generating code, THE Code_Generator SHALL add a header comment indicating the file is auto-generated
4. WHEN generating type names, THE Code_Generator SHALL use PascalCase for interfaces and types
5. WHEN generating function names, THE Code_Generator SHALL use camelCase for function names

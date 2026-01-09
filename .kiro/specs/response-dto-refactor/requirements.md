# Requirements Document

## Introduction

本功能旨在重构 NestJS 后端项目的响应数据结构，将现有的 VO（View Object）模式替换为 Response DTO 模式。通过统一的 DTO 目录结构和 `class-transformer` 序列化机制，实现响应数据的自动过滤，防止敏感字段泄露，并提高代码的可维护性和一致性。

## Glossary

- **Response_DTO**: 响应数据传输对象，用于定义 API 返回给前端的数据结构
- **Request_DTO**: 请求数据传输对象，用于定义前端发送给 API 的数据结构
- **ClassSerializerInterceptor**: NestJS 内置拦截器，用于自动序列化响应数据
- **class-transformer**: 用于对象转换和序列化的库，提供 @Exclude、@Expose 等装饰器
- **Sensitive_Fields**: 敏感字段，如 password、delFlag、tenantId 等不应返回给前端的字段

## Requirements

### Requirement 1: 全局序列化拦截器配置

**User Story:** 作为开发者，我希望系统能自动处理响应数据的序列化，以便 @Exclude 和 @Expose 装饰器能够生效。

#### Acceptance Criteria

1. WHEN 应用启动时，THE System SHALL 全局注册 ClassSerializerInterceptor
2. WHEN Controller 返回数据时，THE ClassSerializerInterceptor SHALL 自动根据 Response_DTO 的装饰器过滤字段
3. WHEN 响应数据包含 @Exclude 标记的字段时，THE System SHALL 从响应中移除该字段

### Requirement 2: DTO 目录结构重组

**User Story:** 作为开发者，我希望 DTO 文件按照请求和响应分类组织，以便代码结构更清晰。

#### Acceptance Criteria

1. THE System SHALL 在每个模块的 dto 目录下创建 requests 和 responses 子目录
2. WHEN 存在 vo 目录时，THE System SHALL 将 vo 文件迁移到 dto/responses 目录
3. THE System SHALL 将现有请求 DTO 文件移动到 dto/requests 目录
4. WHEN 迁移完成后，THE System SHALL 删除空的 vo 目录

### Requirement 3: Response DTO 定义规范

**User Story:** 作为开发者，我希望 Response DTO 能够明确定义哪些字段返回给前端，以防止敏感数据泄露。

#### Acceptance Criteria

1. THE Response_DTO SHALL 使用 @Expose() 装饰器标记需要返回的字段
2. THE Response_DTO SHALL 使用 @Exclude() 装饰器标记敏感字段（password、delFlag、tenantId 等）
3. THE Response_DTO SHALL 保留 @ApiProperty() 装饰器用于 Swagger 文档生成
4. WHEN 定义列表响应时，THE Response_DTO SHALL 包含 rows 和 total 字段

### Requirement 4: Controller 层响应转换

**User Story:** 作为开发者，我希望 Controller 返回的数据能够自动转换为 Response DTO 实例，以确保序列化装饰器生效。

#### Acceptance Criteria

1. WHEN Controller 返回数据时，THE System SHALL 使用 plainToInstance() 将数据转换为 Response_DTO 实例
2. WHEN 返回列表数据时，THE System SHALL 对列表中的每个元素进行转换
3. WHEN 转换失败时，THE System SHALL 记录错误日志并返回原始数据

### Requirement 5: 敏感字段统一过滤

**User Story:** 作为系统管理员，我希望所有 API 响应都不包含敏感字段，以保护系统安全。

#### Acceptance Criteria

1. THE System SHALL 定义统一的敏感字段列表（password、delFlag、tenantId、createBy、updateBy）
2. WHEN 响应数据包含敏感字段时，THE ClassSerializerInterceptor SHALL 自动移除这些字段
3. THE System SHALL 提供基础 Response_DTO 类，包含通用的敏感字段排除配置

### Requirement 6: 现有模块迁移

**User Story:** 作为开发者，我希望所有现有模块能够平滑迁移到新的 Response DTO 模式，以保持系统稳定。

#### Acceptance Criteria

1. THE System SHALL 迁移所有包含 vo 目录的模块，包括：
   - main 模块
   - monitor 模块
   - system/config 模块
   - system/dept 模块
   - system/dict 模块
   - system/file-manager 模块
   - system/menu 模块
   - system/notice 模块
   - system/post 模块
   - system/role 模块
   - system/tenant 模块
   - system/tenant-package 模块
   - system/user 模块
2. WHEN 迁移模块时，THE System SHALL 保持 API 响应结构不变（除移除敏感字段外）
3. WHEN 迁移完成后，THE System SHALL 更新相关的 import 路径
4. THE System SHALL 确保 Swagger 文档正常生成
5. THE System SHALL 删除所有已迁移模块的 vo 目录

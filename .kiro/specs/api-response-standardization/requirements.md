# Requirements Document

## Introduction

本规范旨在系统性地修复 server 端所有 API 接口的响应格式不一致问题，确保所有接口遵循统一的响应标准，包括：统一使用 Result 类、DTO 转换、日期格式化、分页参数完整性等。

## Glossary

- **Result**: 统一响应结果类，提供 `ok()`, `fail()`, `page()` 等静态方法
- **DTO**: Data Transfer Object，数据传输对象，用于控制返回字段和排除敏感信息
- **ResponseDto**: 响应 DTO，继承 BaseResponseDto 自动排除敏感字段
- **FormatDateFields**: 日期格式化工具函数，将 Date 对象转为字符串
- **toDtoList**: 将数组转换为 DTO 列表的工具函数
- **toDto**: 将单个对象转换为 DTO 的工具函数
- **toDtoPage**: 将分页数据转换为 DTO 分页格式的工具函数
- **Service**: NestJS 服务层，处理业务逻辑并返回 Result 对象

## Requirements

### Requirement 1: 统一分页响应格式

**User Story:** As a 前端开发者, I want 所有分页接口返回一致的格式, so that 我可以使用统一的分页组件处理数据。

#### Acceptance Criteria

1. WHEN Service 方法返回分页数据 THEN THE Result.page() SHALL 包含完整的四个参数 (rows, total, pageNum, pageSize)
2. WHEN 使用 Result.page() THEN THE Response SHALL 包含 pages 字段（总页数）
3. WHEN 分页数据为空 THEN THE Result.page() SHALL 返回空数组和 total 为 0

### Requirement 2: 统一 DTO 转换

**User Story:** As a 系统管理员, I want API 不返回敏感字段, so that 系统数据安全得到保障。

#### Acceptance Criteria

1. WHEN Service 方法返回列表数据 THEN THE Service SHALL 使用 toDtoList() 进行转换
2. WHEN Service 方法返回单个对象 THEN THE Service SHALL 使用 toDto() 进行转换
3. WHEN Service 方法返回分页数据 THEN THE Service SHALL 使用 toDtoPage() 进行转换
4. WHEN 返回数据包含敏感字段 (password, delFlag, tenantId) THEN THE ResponseDto SHALL 排除这些字段

### Requirement 3: 统一日期格式化

**User Story:** As a 前端开发者, I want 所有日期字段格式一致, so that 我可以统一处理日期显示。

#### Acceptance Criteria

1. WHEN Service 方法返回包含日期字段的数据 THEN THE Service SHALL 调用 FormatDateFields() 进行格式化
2. WHEN 日期字段为 null THEN THE FormatDateFields() SHALL 保持 null 值不变
3. WHEN 日期字段存在 THEN THE Response SHALL 返回 ISO 8601 格式字符串

### Requirement 4: 统一 Result 包装

**User Story:** As a 前端开发者, I want 所有 API 响应结构一致, so that 我可以使用统一的响应处理逻辑。

#### Acceptance Criteria

1. WHEN Service 方法执行成功 THEN THE Service SHALL 返回 Result.ok() 包装的数据
2. WHEN Service 方法执行失败 THEN THE Service SHALL 返回 Result.fail() 包装的错误信息
3. WHEN Service 方法创建/更新/删除成功 THEN THE Service SHALL 返回 Result.ok() 或 Result.ok(null, '操作成功')
4. IF Service 内部方法被其他 Service 调用 THEN THE Service SHALL 返回 Result 包装的数据以保持一致性

### Requirement 5: 修复 TypeScript 类型警告

**User Story:** As a 开发者, I want 代码没有类型警告, so that 代码质量得到保障。

#### Acceptance Criteria

1. WHEN 使用 ListToTree 回调函数 THEN THE Callback 参数 SHALL 有明确的类型定义
2. WHEN 存在隐式 any 类型 THEN THE Code SHALL 添加显式类型注解
3. WHEN 存在未使用的导入 THEN THE Code SHALL 移除未使用的导入

### Requirement 6: 统一 optionselect 方法返回格式

**User Story:** As a 前端开发者, I want 所有下拉选择接口返回格式一致, so that 我可以使用统一的选择组件。

#### Acceptance Criteria

1. WHEN optionselect 方法返回数据 THEN THE Service SHALL 使用 toDtoList() 进行转换
2. WHEN optionselect 方法返回数据 THEN THE Response SHALL 只包含必要的字段 (id, name/label)

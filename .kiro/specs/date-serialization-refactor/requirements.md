# Requirements Document

## Introduction

本功能旨在重构项目中的日期格式化方案，将当前在 Service 层手动调用 `FormatDateFields()` 的方式，改造为使用 `class-transformer` 装饰器在序列化层自动处理。这是一个企业级的最佳实践，能够实现关注点分离、减少代码重复、提高可维护性。

## Glossary

- **DateFormat_Decorator**: 自定义日期格式化装饰器，基于 `class-transformer` 的 `@Transform` 实现，用于在 DTO 序列化时自动格式化日期字段
- **Response_DTO**: 响应数据传输对象，定义 API 返回的数据结构，使用 `@Expose()` 控制字段暴露
- **Serialization_Layer**: 序列化层，负责将内部数据结构转换为 API 响应格式的处理层
- **FormatDateFields**: 当前使用的日期格式化工具函数，需要在 Service 层手动调用
- **class-transformer**: NestJS 推荐的对象转换库，支持装饰器方式定义转换规则

## Requirements

### Requirement 1: 日期格式化装饰器

**User Story:** As a 开发者, I want 使用装饰器声明式地定义日期格式化规则, so that 我不需要在每个 Service 方法中手动调用格式化函数。

#### Acceptance Criteria

1. THE DateFormat_Decorator SHALL 将 Date 对象转换为 'YYYY-MM-DD HH:mm:ss' 格式的字符串
2. WHEN 日期字段值为 null 或 undefined THEN THE DateFormat_Decorator SHALL 保持原值不变
3. WHEN 日期字段值为有效的 ISO 字符串 THEN THE DateFormat_Decorator SHALL 将其转换为标准格式
4. WHERE 需要自定义格式 THE DateFormat_Decorator SHALL 支持传入自定义格式参数
5. THE DateFormat_Decorator SHALL 使用 Asia/Beijing 时区进行格式化

### Requirement 2: Response DTO 基类增强

**User Story:** As a 开发者, I want Response DTO 基类自动处理常见的日期字段, so that 子类 DTO 无需重复定义日期格式化规则。

#### Acceptance Criteria

1. THE BaseResponseDto SHALL 为 createTime 字段应用 DateFormat_Decorator
2. THE BaseResponseDto SHALL 为 updateTime 字段应用 DateFormat_Decorator
3. WHEN 子类 DTO 继承 BaseResponseDto THEN THE 子类 SHALL 自动继承日期格式化行为
4. WHERE 子类需要额外的日期字段 THE 子类 SHALL 能够使用 DateFormat_Decorator 装饰这些字段

### Requirement 3: 序列化工具函数增强

**User Story:** As a 开发者, I want 序列化工具函数自动触发日期格式化, so that 我只需调用 toDto/toDtoList 即可完成所有转换。

#### Acceptance Criteria

1. WHEN 调用 toDto() 函数 THEN THE Serialization_Layer SHALL 自动执行 DateFormat_Decorator 的转换逻辑
2. WHEN 调用 toDtoList() 函数 THEN THE Serialization_Layer SHALL 对数组中每个元素执行日期格式化
3. WHEN 调用 toDtoPage() 函数 THEN THE Serialization_Layer SHALL 对分页数据中的 rows 执行日期格式化
4. THE 序列化工具函数 SHALL 保持向后兼容，不影响现有未使用装饰器的 DTO

### Requirement 4: Service 层代码清理

**User Story:** As a 开发者, I want 移除 Service 层中手动调用 FormatDateFields 的代码, so that Service 层只关注业务逻辑。

#### Acceptance Criteria

1. WHEN Service 方法返回数据 THEN THE Service SHALL 直接返回原始数据，不调用 FormatDateFields
2. WHEN 使用 Result.page() 返回分页数据 THEN THE Service SHALL 传入原始列表数据
3. WHEN 使用 Result.ok() 返回单条数据 THEN THE Service SHALL 传入原始数据对象
4. THE Service 层 SHALL 不再导入 FormatDateFields 函数

### Requirement 5: 废弃旧方案

**User Story:** As a 架构师, I want 标记 FormatDateFields 为废弃并最终移除, so that 团队统一使用新方案。

#### Acceptance Criteria

1. THE FormatDateFields 函数 SHALL 添加 @deprecated JSDoc 注释
2. WHEN 开发者使用 FormatDateFields THEN THE IDE SHALL 显示废弃警告
3. WHEN 所有 Service 完成迁移 THEN THE FormatDateFields 函数 SHALL 被移除
4. THE 废弃过程 SHALL 分阶段进行，先标记废弃再移除


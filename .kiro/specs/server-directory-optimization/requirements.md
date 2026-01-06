# Requirements Document

## Introduction

优化 NestJS 后端服务器（server）的目录结构，解决当前存在的重复目录、功能分散、命名不一致等问题，建立清晰、可维护的项目架构。

## Glossary

- **Server**: NestJS 后端服务应用
- **Module**: NestJS 业务模块，包含 controller、service、dto 等
- **Infrastructure**: 基础设施层，包含数据库、缓存、队列等技术实现
- **Core**: 核心层，包含全局装饰器、过滤器、守卫、拦截器、中间件
- **Shared**: 共享层，包含跨模块共享的常量、DTO、实体、枚举、工具等
- **Domain**: 领域层，包含业务逻辑和领域模型

## Requirements

### Requirement 1: 消除重复目录结构

**User Story:** 作为开发者，我希望消除 `common/` 和 `shared/` 之间的重复结构，以便更容易找到和维护代码。

#### Acceptance Criteria

1. WHEN 开发者查找共享代码时 THEN THE Server SHALL 在单一的 `shared/` 目录下提供所有共享资源
2. WHEN `common/` 目录中存在与 `shared/` 重复的子目录时 THEN THE Server SHALL 将这些内容合并到 `shared/` 目录
3. WHEN 合并完成后 THEN THE Server SHALL 删除 `common/` 目录中的重复子目录

### Requirement 2: 统一基础设施层

**User Story:** 作为开发者，我希望所有基础设施相关代码集中在 `infrastructure/` 目录下，以便清晰区分技术实现和业务逻辑。

#### Acceptance Criteria

1. WHEN 开发者需要修改缓存实现时 THEN THE Server SHALL 在 `infrastructure/cache/` 目录下提供所有缓存相关代码
2. WHEN `common/` 目录中存在基础设施代码（cache, prisma, dataloader, resilience）时 THEN THE Server SHALL 将这些内容迁移到 `infrastructure/` 目录
3. WHEN 迁移完成后 THEN THE Server SHALL 更新所有相关的导入路径

### Requirement 3: 整合核心层

**User Story:** 作为开发者，我希望所有全局核心功能（装饰器、过滤器、守卫、拦截器、中间件）集中在 `core/` 目录下。

#### Acceptance Criteria

1. WHEN 开发者需要添加全局装饰器时 THEN THE Server SHALL 在 `core/decorators/` 目录下提供统一位置
2. WHEN `common/` 目录中存在核心功能代码时 THEN THE Server SHALL 将这些内容迁移到 `core/` 目录
3. WHEN 存在命名不一致的目录（如 `interceptor/` 和 `interceptors/`）时 THEN THE Server SHALL 统一使用复数形式命名

### Requirement 4: 整合可观测性层

**User Story:** 作为开发者，我希望所有可观测性相关代码（审计、健康检查、指标、日志）集中在 `observability/` 目录下。

#### Acceptance Criteria

1. WHEN 开发者需要配置监控功能时 THEN THE Server SHALL 在 `observability/` 目录下提供所有相关代码
2. WHEN `common/` 目录中存在可观测性代码（audit, health, metrics, logger）时 THEN THE Server SHALL 将这些内容迁移到 `observability/` 目录
3. WHEN 迁移完成后 THEN THE Server SHALL 确保所有监控功能正常工作

### Requirement 5: 整合安全层

**User Story:** 作为开发者，我希望所有安全相关代码集中在 `security/` 目录下。

#### Acceptance Criteria

1. WHEN 开发者需要修改加密逻辑时 THEN THE Server SHALL 在 `security/` 目录下提供所有安全相关代码
2. WHEN `common/` 目录中存在安全代码（crypto, security）时 THEN THE Server SHALL 将这些内容迁移到 `security/` 目录
3. WHEN 迁移完成后 THEN THE Server SHALL 确保所有安全功能正常工作

### Requirement 6: 整合租户层

**User Story:** 作为开发者，我希望所有多租户相关代码集中在 `tenant/` 目录下。

#### Acceptance Criteria

1. WHEN 开发者需要修改租户逻辑时 THEN THE Server SHALL 在 `tenant/` 目录下提供所有租户相关代码
2. WHEN `common/` 目录中存在租户代码时 THEN THE Server SHALL 将这些内容迁移到 `tenant/` 目录
3. WHEN 迁移完成后 THEN THE Server SHALL 确保多租户功能正常工作

### Requirement 7: 清理空目录和冗余结构

**User Story:** 作为开发者，我希望项目中没有空目录和冗余结构，以保持代码库整洁。

#### Acceptance Criteria

1. WHEN 存在空目录（如 `cls/`）时 THEN THE Server SHALL 删除这些空目录
2. WHEN `common/` 目录在迁移后为空或仅包含少量文件时 THEN THE Server SHALL 将剩余内容迁移到适当位置并删除 `common/` 目录
3. WHEN 清理完成后 THEN THE Server SHALL 确保没有孤立的空目录

### Requirement 8: 集中管理测试文件

**User Story:** 作为开发者，我希望所有测试文件集中在 `test/` 目录下，以便统一管理和运行测试。

#### Acceptance Criteria

1. WHEN 开发者需要查找测试文件时 THEN THE Server SHALL 在 `test/` 目录下提供所有测试文件
2. WHEN `src/` 目录中存在 `.spec.ts` 测试文件时 THEN THE Server SHALL 将这些测试文件迁移到 `test/` 目录下对应的子目录
3. WHEN 测试文件迁移后 THEN THE Server SHALL 保持与源文件相同的目录结构（如 `src/config/config.transformer.spec.ts` 迁移到 `test/config/config.transformer.spec.ts`）
4. WHEN 迁移完成后 THEN THE Server SHALL 更新 Jest 配置以正确识别测试文件位置

### Requirement 9: 保持向后兼容

**User Story:** 作为开发者，我希望目录结构优化后所有现有功能继续正常工作。

#### Acceptance Criteria

1. WHEN 目录结构变更后 THEN THE Server SHALL 更新所有受影响的导入路径
2. WHEN 导入路径更新后 THEN THE Server SHALL 通过 TypeScript 编译验证
3. WHEN 编译通过后 THEN THE Server SHALL 通过所有现有测试用例

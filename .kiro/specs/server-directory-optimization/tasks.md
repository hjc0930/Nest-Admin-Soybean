# Implementation Plan: Server Directory Optimization

## Overview

本任务列表将 server 目录结构优化分解为可执行的步骤，按照迁移策略分阶段实施。

## Tasks

- [x] 1. 准备工作
  - [x] 1.1 创建目标目录结构
    - 在 `infrastructure/` 下创建 `prisma/`, `repository/` 子目录
    - 在 `observability/` 下确认 `audit/`, `health/`, `metrics/` 子目录存在
    - 在 `security/` 下确认 `crypto/`, `login/`, `token/` 子目录存在
    - 在 `test/` 下创建 `unit/` 子目录结构
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 8.1_

- [x] 2. 迁移共享层代码
  - [x] 2.1 合并 `common/constant/` 到 `shared/constants/`
    - 迁移所有常量定义文件
    - 更新导入路径
    - _Requirements: 1.2, 1.3_
  - [x] 2.2 合并 `common/dto/` 到 `shared/dto/`
    - 迁移所有 DTO 文件
    - 更新导入路径
    - _Requirements: 1.2, 1.3_
  - [x] 2.3 合并 `common/entities/` 到 `shared/entities/`
    - 迁移所有实体文件
    - 更新导入路径
    - _Requirements: 1.2, 1.3_
  - [x] 2.4 合并 `common/enum/` 到 `shared/enums/`
    - 迁移所有枚举文件
    - 更新导入路径
    - _Requirements: 1.2, 1.3_
  - [x] 2.5 合并 `common/exceptions/` 到 `shared/exceptions/`
    - 迁移所有异常文件
    - 更新导入路径
    - _Requirements: 1.2, 1.3_
  - [x] 2.6 合并 `common/response/` 到 `shared/response/`
    - 迁移所有响应文件
    - 更新导入路径
    - _Requirements: 1.2, 1.3_
  - [x] 2.7 合并 `common/utils/` 到 `shared/utils/`
    - 迁移所有工具文件
    - 更新导入路径
    - _Requirements: 1.2, 1.3_
  - [x] 2.8 合并 `common/validators/` 到 `shared/validators/`
    - 迁移所有验证器文件
    - 更新导入路径
    - _Requirements: 1.2, 1.3_

- [x] 3. 迁移核心层代码
  - [x] 3.1 合并 `common/decorators/` 到 `core/decorators/`
    - 迁移所有装饰器文件
    - 更新导入路径
    - _Requirements: 3.2_
  - [x] 3.2 合并 `common/filters/` 到 `core/filters/`
    - 迁移所有过滤器文件
    - 更新导入路径
    - _Requirements: 3.2_
  - [x] 3.3 合并 `common/guards/` 到 `core/guards/`
    - 迁移所有守卫文件
    - 更新导入路径
    - _Requirements: 3.2_
  - [x] 3.4 合并 `common/interceptor/` 和 `common/interceptors/` 到 `core/interceptors/`
    - 合并两个拦截器目录
    - 统一使用复数形式命名
    - 更新导入路径
    - _Requirements: 3.2, 3.3_
  - [x] 3.5 合并 `common/middleware/` 到 `core/middleware/`
    - 迁移所有中间件文件
    - 更新导入路径
    - _Requirements: 3.2_

- [x] 4. 迁移基础设施层代码
  - [x] 4.1 合并 `common/cache/` 到 `infrastructure/cache/`
    - 迁移缓存服务文件
    - 更新导入路径
    - _Requirements: 2.2, 2.3_
  - [x] 4.2 合并 `common/dataloader/` 到 `infrastructure/dataloader/`
    - 迁移数据加载器文件
    - 更新导入路径
    - _Requirements: 2.2, 2.3_
  - [x] 4.3 合并 `common/logger/` 到 `infrastructure/logging/`
    - 迁移日志配置文件
    - 更新导入路径
    - _Requirements: 2.2, 2.3_
  - [x] 4.4 迁移 `src/prisma/` 到 `infrastructure/prisma/`
    - 迁移 Prisma 服务文件
    - 合并 `common/prisma/` 的扩展
    - 更新导入路径
    - _Requirements: 2.2, 2.3_
  - [x] 4.5 迁移 `common/repository/` 到 `infrastructure/repository/`
    - 迁移仓储基类文件
    - 更新导入路径
    - _Requirements: 2.2, 2.3_

- [x] 5. 迁移可观测性层代码
  - [x] 5.1 合并 `common/audit/` 到 `observability/audit/`
    - 迁移审计服务文件
    - 更新导入路径
    - _Requirements: 4.2, 4.3_
  - [x] 5.2 合并 `common/health/` 到 `observability/health/`
    - 迁移健康检查文件
    - 更新导入路径
    - _Requirements: 4.2, 4.3_
  - [x] 5.3 合并 `common/metrics/` 到 `observability/metrics/`
    - 迁移指标服务文件
    - 更新导入路径
    - _Requirements: 4.2, 4.3_

- [x] 6. 迁移安全层代码
  - [x] 6.1 合并 `common/crypto/` 到 `security/crypto/`
    - 迁移加密服务文件
    - 更新导入路径
    - _Requirements: 5.2, 5.3_
  - [x] 6.2 合并 `common/security/` 到 `security/login/`
    - 迁移登录安全服务文件
    - 更新导入路径
    - _Requirements: 5.2, 5.3_

- [x] 7. 迁移租户层代码
  - [x] 7.1 合并 `common/tenant/` 到 `tenant/services/`
    - 迁移租户服务文件
    - 合并 `common/cls/` 到 `tenant/context/`
    - 更新导入路径
    - _Requirements: 6.2, 6.3_

- [x] 8. 迁移弹性层代码
  - [x] 8.1 合并 `common/resilience/` 到 `resilience/circuit-breaker/`
    - 迁移熔断器服务文件
    - 更新导入路径
    - _Requirements: 2.2, 2.3_

- [x] 9. Checkpoint - 验证源代码迁移
  - 运行 TypeScript 编译验证
  - 确保所有导入路径正确
  - 如有问题请暂停并询问用户

- [x] 10. 迁移测试文件
  - [x] 10.1 迁移 `src/config/` 测试文件到 `test/unit/config/`
    - 迁移 `config.transformer.spec.ts`, `env.validation.spec.ts`
    - 更新测试文件中的导入路径
    - _Requirements: 8.2, 8.3_
  - [x] 10.2 迁移 `src/common/` 测试文件到 `test/unit/` 对应目录
    - 按照新目录结构迁移测试文件
    - 更新测试文件中的导入路径
    - _Requirements: 8.2, 8.3_
  - [x] 10.3 迁移 `src/module/` 测试文件到 `test/unit/module/`
    - 迁移所有模块测试文件
    - 更新测试文件中的导入路径
    - _Requirements: 8.2, 8.3_
  - [x] 10.4 迁移 `src/prisma/` 测试文件到 `test/unit/infrastructure/prisma/`
    - 注: `prisma.service.spec.ts` 不存在 (src/prisma 目录已迁移到 infrastructure/prisma)
    - _Requirements: 8.2, 8.3_
  - [x] 10.5 更新 Jest 配置
    - 更新 `jest.config.js` 的 `testRegex` 配置支持 `test/unit/` 目录
    - 更新 `moduleNameMapper` 添加 `@/` 路径别名
    - _Requirements: 8.4_

- [x] 11. 清理工作
  - [x] 11.1 删除空目录 `src/cls/`
    - _Requirements: 7.1_
  - [x] 11.2 删除已迁移的 `common/` 目录
    - 确认所有内容已迁移
    - 删除整个 `common/` 目录
    - _Requirements: 7.2_
  - [x] 11.3 检查并删除其他空目录
    - 扫描项目中的空目录
    - 删除不需要的空目录
    - _Requirements: 7.3_

- [x] 12. 更新模块注册
  - [x] 12.1 更新 `app.module.ts`
    - 更新所有模块导入路径
    - 确保模块注册正确
    - _Requirements: 9.1_
  - [x] 12.2 更新各子模块的导入
    - 检查并更新所有子模块的导入路径
    - _Requirements: 9.1_

- [x] 13. Final Checkpoint - 完整验证
  - [x] 13.1 运行 TypeScript 编译
    - 执行 `pnpm build`
    - 确保无编译错误
    - _Requirements: 9.2_
  - [x] 13.2 运行单元测试
    - 执行 `pnpm test`
    - 确保所有测试通过
    - _Requirements: 9.3_
  - [x] 13.3 运行端到端测试
    - 执行 `pnpm test:e2e`
    - 确保所有 E2E 测试通过
    - _Requirements: 9.3_

## Notes

- 每个迁移步骤都需要同时更新导入路径
- 建议使用 IDE 的重构功能或脚本批量更新导入
- 迁移过程中保持 Git 提交，便于回滚
- 如遇到文件冲突，优先保留功能更完整的版本

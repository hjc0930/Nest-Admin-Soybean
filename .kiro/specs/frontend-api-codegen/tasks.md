# Implementation Plan: Frontend API Code Generation

## Overview

使用 @hey-api/openapi-ts 库实现基于 OpenAPI 规范的前端 API 代码自动生成，配置自定义客户端适配器与现有的 `@/service/request` 封装集成。

## Tasks

- [x] 1. 安装依赖和创建配置文件
  - [x] 1.1 安装 @hey-api/openapi-ts 开发依赖
    - 运行 `pnpm add -D @hey-api/openapi-ts` 安装代码生成工具
    - _Requirements: 6.1_
  - [x] 1.2 创建 openapi-ts.config.ts 配置文件
    - 在 admin-naive-ui 目录下创建配置文件
    - 配置输入为 `../server/openApi.json`
    - 配置输出目录为 `src/service/api-gen`
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 1.3 添加 npm script 命令
    - 在 package.json 中添加 `gen-api` 脚本
    - _Requirements: 6.1_

- [x] 2. 创建自定义客户端适配器
  - [x] 2.1 创建 client.ts 适配器文件
    - 创建 `src/service/api-gen/client.ts`
    - 实现与现有 `request` 封装的集成
    - 处理路径参数替换
    - 处理查询参数和请求体
    - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [x] 3. 运行代码生成并验证
  - [x] 3.1 首次运行代码生成
    - 执行 `pnpm gen-api` 生成代码
    - _Requirements: 6.2, 6.3_
  - [x] 3.2 验证生成的代码
    - 检查生成的 types.gen.ts 类型定义
    - 检查生成的 services.gen.ts API 函数
    - 运行 `pnpm typecheck` 验证无类型错误
    - _Requirements: 7.2_

- [x] 4. 调整生成配置（如需要）
  - [x] 4.1 根据生成结果调整配置
    - 如果函数命名不符合预期，调整配置
    - 如果需要过滤某些 tag，添加过滤配置
    - _Requirements: 5.5_
  - [x] 4.2 重新生成并验证
    - 重新运行生成命令
    - 验证调整后的输出符合预期
    - _Requirements: 6.3_

- [x] 5. Checkpoint - 确保生成的代码可用
  - 确保所有测试通过，如有问题请询问用户

- [x] 6. 创建使用示例和文档
  - [x] 6.1 更新 .gitignore
    - 添加 `src/service/api-gen/*.gen.ts` 到 .gitignore（可选，取决于是否要提交生成的代码）
    - _Requirements: 4.5_
  - [x] 6.2 创建使用说明
    - 在 README 或相关文档中添加 API 生成的使用说明
    - 说明如何运行生成命令
    - 说明如何使用生成的 API 函数
    - _Requirements: 7.1_

## Notes

- 使用成熟的 @hey-api/openapi-ts 库，无需从头实现代码生成逻辑
- 自定义客户端适配器是唯一需要手动编写的代码
- 生成的代码会自动包含 JSDoc 注释（来自 OpenAPI summary）
- 每次后端 API 变更后，只需重新运行 `pnpm gen-api` 即可更新前端代码

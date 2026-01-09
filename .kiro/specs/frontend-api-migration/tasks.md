# Implementation Plan: Frontend API Migration

## Overview

将前端项目完全迁移到使用 `@hey-api/openapi-ts` 自动生成的 API 代码。通过创建自定义客户端适配器，让生成的 API 函数使用现有的 `request` 函数，保持认证、加密、错误处理等功能。

## Tasks

- [x] 1. 创建自定义客户端适配器
  - [x] 1.1 创建 `src/service/api-gen/client.ts` 自定义客户端
    - 实现 Client 接口，将请求转换为使用现有 request 函数
    - 处理路径参数替换
    - 处理查询参数
    - 处理特殊请求头（isToken, isEncrypt, repeatSubmit）
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 1.2 更新 `openapi-ts.config.ts` 配置
    - 配置使用自定义客户端
    - 确保生成的 SDK 使用自定义客户端
    - _Requirements: 2.2_

- [x] 2. 重新生成 API 代码并验证
  - [x] 2.1 运行 `pnpm openapi-ts` 重新生成 API 代码
    - 验证生成的代码使用自定义客户端
    - _Requirements: 2.2_
  - [ ]* 2.2 编写自定义客户端适配器单元测试
    - 测试请求参数转换
    - 测试响应数据返回
    - 测试错误传播
    - **Property 1: Request Headers Injection**
    - **Validates: Requirements 1.1, 1.2**

- [x] 3. Checkpoint - 验证基础设施
  - 确保自定义客户端适配器正常工作
  - 确保生成的 API 函数可以正确调用
  - 如有问题请询问用户

- [x] 4. 迁移认证模块
  - [x] 4.1 更新登录页面使用生成的 API
    - 将 `fetchLogin` 替换为 `authControllerLoginV1`
    - 将 `fetchGetCaptchaCode` 替换为 `authControllerGetCaptchaCodeV1`
    - 将 `fetchGetTenantList` 替换为 `authControllerGetTenantListV1`
    - 更新类型定义使用生成的 DTO
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 4.2 更新 auth store 使用生成的 API
    - 将 `fetchGetUserInfo` 替换为 `userControllerGetInfoV1`
    - 将 `fetchLogout` 替换为 `authControllerLogoutV1`
    - 更新类型定义使用生成的 DTO
    - _Requirements: 4.5, 4.6_
  - [x] 4.3 更新路由守卫使用生成的 API
    - 确保路由守卫中的 API 调用使用生成的函数
    - _Requirements: 4.6_

- [x] 5. 迁移系统管理模块
  - [x] 5.1 更新用户管理页面使用生成的 API
    - 替换所有 `userController*V1` 相关 API 调用
    - 更新类型定义使用生成的 DTO
    - _Requirements: 5.6_
  - [x] 5.2 更新角色管理页面使用生成的 API
    - 替换所有 `roleController*V1` 相关 API 调用
    - 更新类型定义使用生成的 DTO
    - _Requirements: 5.4_
  - [x] 5.3 更新菜单管理页面使用生成的 API
    - 替换所有 `menuController*V1` 相关 API 调用
    - 更新类型定义使用生成的 DTO
    - _Requirements: 5.1_
  - [x] 5.4 更新部门管理页面使用生成的 API
    - 替换所有 `deptController*V1` 相关 API 调用
    - 更新类型定义使用生成的 DTO
    - _Requirements: 5.3_
  - [x] 5.5 更新岗位管理页面使用生成的 API
    - 替换所有 `postController*V1` 相关 API 调用
    - 更新类型定义使用生成的 DTO
    - _Requirements: 5.5_
  - [x] 5.6 更新字典管理页面使用生成的 API
    - 替换所有 `dictController*V1` 相关 API 调用
    - 更新类型定义使用生成的 DTO
    - _Requirements: 5.2_

- [x] 6. Checkpoint - 验证系统管理模块
  - 确保所有系统管理页面正常工作
  - 确保 CRUD 操作正常
  - 如有问题请询问用户

- [x] 7. 迁移其他模块
  - [x] 7.1 更新监控模块使用生成的 API
    - 替换服务器监控、缓存监控、在线用户等 API 调用
    - _Requirements: 2.3_
  - [x] 7.2 更新日志模块使用生成的 API
    - 替换操作日志、登录日志等 API 调用
    - _Requirements: 2.3_
  - [x] 7.3 更新通知公告模块使用生成的 API
    - 替换通知公告相关 API 调用
    - _Requirements: 2.3_
  - [x] 7.4 更新定时任务模块使用生成的 API
    - 替换定时任务相关 API 调用
    - _Requirements: 2.3_
  - [x] 7.5 更新租户管理模块使用生成的 API
    - 替换租户、租户套餐相关 API 调用
    - _Requirements: 2.3_
  - [x] 7.6 更新文件管理模块使用生成的 API
    - 替换文件上传、下载相关 API 调用
    - _Requirements: 2.3_

- [x] 8. 删除手写 API 文件
  - [ ] 8.1 删除 `src/service/api` 目录下的所有文件
    - 确保所有组件已迁移完成
    - 删除手写 API 文件
    - _Requirements: 2.1_
  - [ ] 8.2 更新导出路径
    - 确保所有导入路径指向 `api-gen`
    - _Requirements: 2.2, 7.1, 7.2_

- [x] 9. Final Checkpoint - 全面验证
  - 确保所有功能正常工作
  - 确保认证、加密、错误处理等功能正常
  - 确保类型安全
  - 如有问题请询问用户

## Notes

- 任务标记 `*` 的为可选任务，可跳过以加快 MVP 进度
- 每个任务都引用了具体的需求以便追溯
- Checkpoint 任务用于增量验证
- 迁移过程中保持现有功能不变

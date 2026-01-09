# Implementation Plan: OpenAPI Response Type Fix

## Overview

本实现计划将为所有缺失响应类型的 API 接口创建对应的 VO 类，并更新 Controller 中的 `@Api()` 装饰器以正确引用这些类型，从而修复 OpenAPI 文档中 `data` 字段显示为 `{ value: true }` 的问题。

## Tasks

- [x] 1. 创建通用响应 VO 类
  - [x] 1.1 创建 `server/src/shared/vo/common.vo.ts` 文件
    - 定义 `SuccessVo`、`BooleanResultVo`、`DeleteResultVo`、`CreateResultVo` 类
    - 每个类都需要 `@ApiProperty` 装饰器
    - _Requirements: 2.1, 2.3_

- [x] 2. 更新 Main 模块 VO 类和 Controller
  - [x] 2.1 更新 `server/src/module/main/vo/main.vo.ts`
    - 添加 `LogoutVo`、`RegisterResultVo`、`RegisterEnabledVo` 类
    - _Requirements: 2.1, 2.3_
  - [x] 2.2 更新 `server/src/module/main/main.controller.ts`
    - 为 `logout`、`register`、`registerUser` 方法添加 `type` 参数
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 3. 更新 Auth 模块 VO 类和 Controller
  - [x] 3.1 更新 `server/src/module/main/vo/auth.vo.ts`
    - 添加 `PublicKeyVo`、`AuthRegisterResultVo`、`AuthLogoutVo` 类
    - _Requirements: 2.1, 2.3_
  - [x] 3.2 更新 `server/src/module/main/auth.controller.ts`
    - 为 `register`、`logout`、`socialCallback`、`getPublicKey` 方法添加 `type` 参数
    - _Requirements: 4.4_

- [x] 4. 更新 User 模块 VO 类和 Controller
  - [x] 4.1 更新 `server/src/module/system/user/vo/user.vo.ts`
    - 添加 `CurrentUserInfoVo`、`UserOptionVo`、`UserOptionSelectVo`、`DeptUserListVo` 类
    - 添加操作结果 VO 类（`UpdateProfileResultVo`、`UpdatePwdResultVo` 等）
    - _Requirements: 2.1, 2.3_
  - [x] 4.2 更新 `server/src/module/system/user/user.controller.ts`
    - 为所有缺失 `type` 参数的方法添加响应类型
    - _Requirements: 4.4_

- [x] 5. 创建 File Manager 模块 VO 类
  - [x] 5.1 创建 `server/src/module/system/file-manager/vo/file-manager.vo.ts`
    - 定义文件夹相关 VO 类（`FolderVo`、`FolderTreeNodeVo`、`CreateFolderVo` 等）
    - 定义文件相关 VO 类（`FileVo`、`FileDetailVo`、`FileVersionVo` 等）
    - 定义分享相关 VO 类（`ShareVo`、`ShareInfoVo`、`CreateShareVo` 等）
    - 定义存储统计 VO 类（`StorageStatsVo`）
    - _Requirements: 2.1, 2.3_
  - [x] 5.2 更新 `server/src/module/system/file-manager/file-manager.controller.ts`
    - 为所有方法添加 `type` 参数
    - _Requirements: 4.4_

- [x] 6. 更新 Dept 模块 Controller
  - [x] 6.1 更新 `server/src/module/system/dept/vo/dept.vo.ts`
    - 添加操作结果 VO 类（`CreateDeptResultVo`、`UpdateDeptResultVo`、`DeleteDeptResultVo`）
    - _Requirements: 2.1, 2.3_
  - [x] 6.2 更新 `server/src/module/system/dept/dept.controller.ts`
    - 为 `create`、`update`、`remove` 方法添加 `type` 参数
    - _Requirements: 4.4_

- [x] 7. 更新 Role 模块 Controller
  - [x] 7.1 更新 `server/src/module/system/role/vo/role.vo.ts`
    - 添加操作结果 VO 类
    - _Requirements: 2.1, 2.3_
  - [x] 7.2 更新 `server/src/module/system/role/role.controller.ts`
    - 为所有缺失 `type` 参数的方法添加响应类型
    - _Requirements: 4.4_

- [x] 8. 更新其他模块 Controller
  - [x] 8.1 检查并更新 `server/src/module/system/dict/dict.controller.ts`
    - _Requirements: 4.4_
  - [x] 8.2 检查并更新 `server/src/module/system/menu/menu.controller.ts`
    - _Requirements: 4.4_
  - [x] 8.3 检查并更新 `server/src/module/system/post/post.controller.ts`
    - _Requirements: 4.4_
  - [x] 8.4 检查并更新 `server/src/module/system/notice/notice.controller.ts`
    - _Requirements: 4.4_
  - [x] 8.5 检查并更新 `server/src/module/system/config/config.controller.ts`
    - _Requirements: 4.4_
  - [x] 8.6 检查并更新 `server/src/module/system/tenant/tenant.controller.ts`
    - _Requirements: 4.4_
  - [x] 8.7 检查并更新 `server/src/module/monitor/` 下的所有 Controller
    - _Requirements: 4.4_

- [x] 9. 修改 buildDataSchema 默认行为
  - [x] 9.1 更新 `server/src/core/decorators/api.decorator.ts`
    - 修改 `buildDataSchema` 函数，当无类型时返回更通用的 schema
    - 将 `{ value: true }` 改为 `{ type: 'object', additionalProperties: true }`
    - _Requirements: 3.1_

- [x] 10. Checkpoint - 验证 OpenAPI 文档
  - 重新生成 OpenAPI 文档
  - 验证所有接口的响应类型正确
  - 确保没有 `{ value: true }` 默认 schema
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. 编写属性测试
  - [x] 11.1 编写 buildDataSchema 函数的属性测试
    - **Property 1: buildDataSchema 输出正确性**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  - [x] 11.2 编写 OpenAPI 文档完整性测试
    - **Property 2: OpenAPI 文档完整性**
    - **Validates: Requirements 5.1**
  - [x] 11.3 编写 VO 类属性完整性测试
    - **Property 3: VO 类属性完整性**
    - **Validates: Requirements 2.3**

- [x] 12. Final checkpoint - 确保所有测试通过
  - All 19 tests passed
  - OpenAPI document verified: no `{ value: true }` found
  - Server started successfully

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases

# Implementation Plan: API 响应格式标准化

## Overview

本实现计划将系统性地修复 server 端所有 API 接口的响应格式不一致问题，按模块逐一修复，确保所有接口遵循统一的响应标准。

## Tasks

- [x] 1. 修复 Result.page() 分页参数不完整问题
  - [x] 1.1 修复 user-role.service.ts 中的 Result.page() 调用
    - 添加 pageNum 和 pageSize 参数
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 修复 tool.service.ts 中的 Result.page() 调用
    - 添加 pageNum 和 pageSize 参数
    - _Requirements: 1.1, 1.2_
  - [x] 1.3 修复 operlog.service.ts 中的 Result.page() 调用
    - 添加 pageNum 和 pageSize 参数
    - _Requirements: 1.1, 1.2_
  - [x] 1.4 修复 job.service.ts 中的 Result.page() 调用
    - 添加 pageNum 和 pageSize 参数
    - _Requirements: 1.1, 1.2_
  - [x] 1.5 修复 online.service.ts 中的 Result.page() 调用
    - 添加 pageNum 和 pageSize 参数
    - _Requirements: 1.1, 1.2_
  - [x] 1.6 修复 post.service.ts 中的 Result.page() 调用
    - 添加 pageNum 和 pageSize 参数
    - _Requirements: 1.1, 1.2_

- [ ] 2. 修复 optionselect 方法缺少 DTO 转换问题
  - [ ] 2.1 修复 role.service.ts 中的 optionselect 方法
    - 创建 RoleOptionResponseDto
    - 使用 toDtoList() 进行转换
    - _Requirements: 6.1, 6.2_

- [x] 3. 修复 TypeScript 类型警告
  - [x] 3.1 修复 dept.service.ts 中 ListToTree 回调的隐式 any 类型
    - 为回调参数添加明确的类型定义
    - _Requirements: 5.1, 5.2_
  - [x] 3.2 修复 menu.service.ts 中 ListToTree 回调的隐式 any 类型
    - 为回调参数添加明确的类型定义
    - 移除未使用的导入 RoleMenuTreeSelectResponseDto
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 3.3 修复 role.service.ts 中 ListToTree 回调的隐式 any 类型
    - 为回调参数添加明确的类型定义
    - _Requirements: 5.1, 5.2_

- [x] 4. 修复 loginlog.service.ts 中 create 方法返回格式
  - 将直接返回 Prisma 结果改为 Result.ok() 包装
  - _Requirements: 4.1_

- [x] 5. Checkpoint - 验证基础修复
  - 确保所有修改的文件没有 TypeScript 编译错误
  - 运行现有单元测试确保没有破坏性变更

- [x] 6. 添加属性测试验证修复效果
  - [x] 6.1 编写分页响应格式完整性属性测试
    - **Property 1: 分页响应格式完整性**
    - **Validates: Requirements 1.1, 1.2**
  - [x] 6.2 编写敏感字段排除属性测试
    - **Property 2: 敏感字段排除**
    - **Validates: Requirements 2.4**

- [x] 7. Final Checkpoint - 确保所有测试通过
  - 运行 pnpm test 确保所有测试通过
  - 确保没有 TypeScript 编译警告

## Notes

- 所有任务均为必需，确保全面测试和质量保障
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- 修复顺序按照影响范围从小到大排列

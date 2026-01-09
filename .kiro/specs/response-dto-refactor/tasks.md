# Implementation Plan: Response DTO Refactor

## Overview

将所有模块的 VO 模式重构为 Response DTO 模式，建立统一的 DTO 目录结构（requests/responses）。

## Tasks

- [x] 1. 创建基础设施
  - [x] 1.1 创建 BaseResponseDto 基础类
    - 在 `src/shared/dto/base.response.dto.ts` 创建基础响应 DTO
    - 使用 @Exclude 标记敏感字段（delFlag、tenantId、createBy、updateBy）
    - _Requirements: 5.1, 5.3_

  - [x] 1.2 创建序列化工具函数
    - 在 `src/shared/utils/serialize.util.ts` 创建 toDto、toDtoList、toDtoPage 函数
    - 配置 excludeExtraneousValues: true
    - _Requirements: 4.1, 4.2_

  - [x] 1.3 编写序列化工具单元测试
    - 测试 toDto 正确转换单个对象
    - 测试 toDtoList 正确转换数组
    - 测试敏感字段被过滤
    - _Requirements: 4.1, 4.2_

- [x] 2. 重构 system/config 模块
  - [x] 2.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 2.2 迁移请求 DTO 到 requests 目录
  - [x] 2.3 创建响应 DTO 到 responses 目录（替代 vo）
  - [x] 2.4 更新 Service 使用序列化工具
  - [x] 2.5 更新 Controller import 路径
  - [x] 2.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 3. 重构 system/user 模块
  - [x] 3.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 3.2 迁移请求 DTO 到 requests 目录
  - [x] 3.3 创建响应 DTO 到 responses 目录
  - [x] 3.4 更新 Service 使用序列化工具
  - [x] 3.5 更新 Controller import 路径
  - [x] 3.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 4. 重构 system/role 模块
  - [x] 4.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 4.2 迁移请求 DTO 到 requests 目录
  - [x] 4.3 创建响应 DTO 到 responses 目录
  - [x] 4.4 更新 Service 使用序列化工具
  - [x] 4.5 更新 Controller import 路径
  - [x] 4.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 5. 重构 system/menu 模块
  - [x] 5.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 5.2 迁移请求 DTO 到 requests 目录
  - [x] 5.3 创建响应 DTO 到 responses 目录
  - [x] 5.4 更新 Service 使用序列化工具
  - [x] 5.5 更新 Controller import 路径
  - [x] 5.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 6. 重构 system/dept 模块
  - [x] 6.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 6.2 迁移请求 DTO 到 requests 目录
  - [x] 6.3 创建响应 DTO 到 responses 目录
  - [x] 6.4 更新 Service 使用序列化工具
  - [x] 6.5 更新 Controller import 路径
  - [x] 6.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 7. 重构 system/dict 模块
  - [x] 7.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 7.2 迁移请求 DTO 到 requests 目录
  - [x] 7.3 创建响应 DTO 到 responses 目录
  - [x] 7.4 更新 Service 使用序列化工具
  - [x] 7.5 更新 Controller import 路径
  - [x] 7.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 8. 重构 system/post 模块
  - [x] 8.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 8.2 迁移请求 DTO 到 requests 目录
  - [x] 8.3 创建响应 DTO 到 responses 目录
  - [x] 8.4 更新 Service 使用序列化工具
  - [x] 8.5 更新 Controller import 路径
  - [x] 8.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 9. 重构 system/notice 模块
  - [x] 9.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 9.2 迁移请求 DTO 到 requests 目录
  - [x] 9.3 创建响应 DTO 到 responses 目录
  - [x] 9.4 更新 Service 使用序列化工具
  - [x] 9.5 更新 Controller import 路径
  - [x] 9.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 10. 重构 system/tenant 模块
  - [x] 10.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 10.2 迁移请求 DTO 到 requests 目录
  - [x] 10.3 创建响应 DTO 到 responses 目录
  - [x] 10.4 更新 Service 使用序列化工具
  - [x] 10.5 更新 Controller import 路径
  - [x] 10.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 11. 重构 system/tenant-package 模块
  - [x] 11.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 11.2 迁移请求 DTO 到 requests 目录
  - [x] 11.3 创建响应 DTO 到 responses 目录
  - [x] 11.4 更新 Service 使用序列化工具
  - [x] 11.5 更新 Controller import 路径
  - [x] 11.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 12. 重构 system/file-manager 模块
  - [x] 12.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 12.2 迁移请求 DTO 到 requests 目录
  - [x] 12.3 创建响应 DTO 到 responses 目录
  - [x] 12.4 更新 Service 使用序列化工具
  - [x] 12.5 更新 Controller import 路径
  - [x] 12.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 13. 重构 main 模块
  - [x] 13.1 创建 dto/requests 和 dto/responses 目录结构
  - [x] 13.2 迁移请求 DTO 到 requests 目录
  - [x] 13.3 创建响应 DTO 到 responses 目录
  - [x] 13.4 更新 Service 使用序列化工具
  - [x] 13.5 更新 Controller import 路径
  - [x] 13.6 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 14. 重构 monitor 模块
  - [x] 14.1 创建 dto/responses 目录结构
  - [x] 14.2 创建响应 DTO 到 responses 目录
  - [x] 14.3 更新各子模块 Service 使用序列化工具
  - [x] 14.4 更新各子模块 Controller import 路径
  - [x] 14.5 删除 vo 目录
  - _Requirements: 2.1, 2.2, 2.4, 3.1, 3.2, 3.3, 4.1, 6.1_

- [x] 15. Checkpoint - 验证所有模块
  - 运行所有测试确保通过
  - 验证 API 响应不包含敏感字段
  - 验证 Swagger 文档正常生成
  - 如有问题请询问用户

- [x] 16. 属性测试
  - [x] 16.1 编写 Property 1: 序列化过滤属性测试
    - **Property 1: 序列化过滤属性**
    - 使用 fast-check 生成随机对象
    - 验证 @Exclude 字段被正确过滤
    - **Validates: Requirements 1.2, 1.3, 5.2**

  - [x] 16.2 编写 Property 2: 数据转换完整性属性测试
    - **Property 2: 数据转换完整性属性**
    - 使用 fast-check 生成随机对象
    - 验证 @Expose 字段值保持不变
    - **Validates: Requirements 4.1, 4.2**

- [x] 17. Final Checkpoint
  - 确保所有测试通过
  - 确认所有模块重构完成
  - 如有问题请询问用户

## Notes

- 迁移过程中保持 API 响应结构不变（除移除敏感字段外）
- 每个模块重构完成后建议运行测试验证
- 所有 vo 目录将被删除，响应 DTO 统一放在 dto/responses 目录

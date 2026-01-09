# Implementation Plan: 企业级测试标准

## Overview

本实现计划将企业级测试标准分解为可执行的任务，按照后端测试基础设施、前端测试基础设施、属性测试实现、测试工具和辅助函数的顺序进行实现。

## Tasks

- [x] 1. 后端测试基础设施配置
  - [x] 1.1 更新 Jest 配置以支持企业级覆盖率阈值
    - 更新 `server/jest.config.js` 中的 coverageThreshold
    - 配置核心模块的更高覆盖率要求
    - 添加多格式覆盖率报告输出
    - _Requirements: 1.1, 1.2, 1.3, 1.7_
  - [x] 1.2 创建测试目录结构
    - 确保 `server/test/` 目录结构符合规范
    - 创建缺失的子目录（fixtures, mocks, helpers）
    - _Requirements: 2.4_
  - [x] 1.3 创建测试设置文件
    - 更新 `server/test/setup.ts` 全局测试设置
    - 配置测试环境变量
    - _Requirements: 4.5, 5.5_

- [x] 2. 后端 Test Fixture 实现
  - [x] 2.1 创建用户 Fixture 工厂
    - 创建 `server/test/fixtures/user.fixture.ts`
    - 实现 createUserFixture, createAdminUser, createBatchUsers
    - 使用 faker 生成真实数据
    - _Requirements: 4.1, 4.2_
  - [x] 2.2 创建角色 Fixture 工厂
    - 创建 `server/test/fixtures/role.fixture.ts`
    - 实现 createRoleFixture, createAdminRole
    - _Requirements: 4.1, 4.2_
  - [x] 2.3 创建租户 Fixture 工厂
    - 创建 `server/test/fixtures/tenant.fixture.ts`
    - 实现 createTenantFixture
    - _Requirements: 4.1, 4.2_
  - [x] 2.4 编写 Fixture 工厂属性测试
    - **Property 3: 测试数据隔离**
    - **Validates: Requirements 4.4**

- [x] 3. 后端 Mock Service 实现
  - [x] 3.1 创建 Prisma Mock 服务
    - 创建 `server/test/mocks/prisma.mock.ts`
    - 实现类型安全的 mock 方法
    - _Requirements: 5.1, 5.2_
  - [x] 3.2 创建 Redis Mock 服务
    - 创建 `server/test/mocks/redis.mock.ts`
    - 实现内存存储的 mock
    - _Requirements: 5.1, 5.2_
  - [x] 3.3 创建 Config Mock 服务
    - 创建 `server/test/mocks/config.mock.ts`
    - 实现配置服务的 mock
    - _Requirements: 5.1_
  - [x] 3.4 编写 Mock 状态重置属性测试
    - **Property 4: Mock 状态重置**
    - **Validates: Requirements 5.5**

- [x] 4. 后端测试辅助函数实现
  - [x] 4.1 创建测试应用辅助函数
    - 创建 `server/test/helpers/test-app.helper.ts`
    - 实现 createTestApp, getAuthToken
    - _Requirements: 9.1_
  - [x] 4.2 创建断言辅助函数
    - 创建 `server/test/helpers/assertion.helper.ts`
    - 实现 expectSuccessResponse, expectPageResponse, expectErrorResponse
    - _Requirements: 7.1_
  - [x] 4.3 创建数据清理辅助函数
    - 创建 `server/test/helpers/cleanup.helper.ts`
    - 实现 cleanupTestData
    - _Requirements: 4.5_

- [x] 5. Checkpoint - 后端测试基础设施验证
  - 确保所有后端测试基础设施正常工作
  - 运行现有测试确保不破坏现有功能
  - 如有问题请询问用户

- [x] 6. 后端属性测试实现
  - [x] 6.1 创建序列化往返属性测试
    - 已存在 `server/src/shared/utils/serialize.util.property.spec.ts`
    - **Property 1: 序列化往返一致性**
    - **Validates: Requirements 3.3**
  - [x] 6.2 创建数据转换不变量属性测试
    - 已存在于序列化属性测试中
    - **Property 2: 数据转换不变量**
    - **Validates: Requirements 3.4**
  - [x] 6.3 创建输入安全验证属性测试
    - 创建 `server/test/unit/security/input-sanitization.pbt.spec.ts`
    - **Property 5: 输入安全验证**
    - **Validates: Requirements 9.2, 9.4**

- [x] 7. 前端测试基础设施配置
  - [x] 7.1 安装前端测试依赖
    - 需要安装 vitest, @vue/test-utils, @testing-library/vue
    - 需要安装 @vitest/coverage-v8, fast-check, msw
    - _Requirements: 11.1, 11.2, 13.3, 14.1_
  - [x] 7.2 创建 Vitest 配置文件
    - 创建 `admin-naive-ui/vitest.config.ts`
    - 配置覆盖率阈值和报告格式
    - _Requirements: 1.4, 1.5, 1.7_
  - [x] 7.3 创建前端测试目录结构
    - 创建 `admin-naive-ui/test/` 目录结构
    - 创建 unit, components, e2e, fixtures, mocks 子目录
    - _Requirements: 2.4_
  - [x] 7.4 创建前端测试设置文件
    - 创建 `admin-naive-ui/test/setup.ts`
    - 配置 MSW 服务器
    - _Requirements: 14.1_

- [x] 8. 前端 MSW Mock 实现
  - [x] 8.1 创建 MSW handlers
    - 创建 `admin-naive-ui/test/mocks/handlers.ts`
    - 实现认证、用户、角色等 API mock
    - _Requirements: 14.1, 5.3_
  - [x] 8.2 创建 MSW server
    - 创建 `admin-naive-ui/test/mocks/server.ts`
    - 配置 MSW 服务器
    - _Requirements: 14.1_

- [x] 9. 前端 Test Fixture 实现
  - [x] 9.1 创建前端用户 Fixture
    - 创建 `admin-naive-ui/test/fixtures/user.fixture.ts`
    - 实现 createUserFixture, createUserListFixture
    - _Requirements: 4.1, 4.2_
  - [x] 9.2 创建 API 响应 Fixture
    - 创建 `admin-naive-ui/test/fixtures/api-response.fixture.ts`
    - 实现各种 API 响应的 fixture
    - _Requirements: 4.1, 4.2_

- [x] 10. 前端测试辅助函数实现
  - [x] 10.1 创建组件挂载辅助函数
    - 创建 `admin-naive-ui/test/helpers/mount.helper.ts`
    - 实现 mountComponent, createTestPinia, createTestRouter
    - _Requirements: 11.5, 11.6_
  - [x] 10.2 创建断言辅助函数
    - 创建 `admin-naive-ui/test/helpers/assertion.helper.ts`
    - 实现前端特定的断言辅助函数
    - _Requirements: 7.1_

- [x] 11. Checkpoint - 前端测试基础设施验证
  - 前端测试基础设施已创建
  - 需要安装依赖后运行测试验证
  - 如有问题请询问用户

- [x] 12. 前端组件测试实现
  - [x] 12.1 创建通用组件测试示例
    - 创建 `admin-naive-ui/test/components/common/Button.spec.ts`
    - 测试渲染、交互、props 变化
    - _Requirements: 11.3, 11.4_
  - [x] 12.2 编写组件行为属性测试
    - 创建 `admin-naive-ui/test/components/common/Button.pbt.spec.ts`
    - **Property 6: 组件行为正确性**
    - **Validates: Requirements 11.3, 11.4, 11.7**

- [x] 13. 前端工具函数测试实现
  - [x] 13.1 创建工具函数单元测试
    - 创建 `admin-naive-ui/test/unit/utils/common.spec.ts`
    - 测试 formatDate, debounce, throttle 等函数
    - _Requirements: 13.1, 13.5_
  - [x] 13.2 创建工具函数属性测试
    - 创建 `admin-naive-ui/test/unit/utils/common.pbt.spec.ts`
    - 测试日期格式化往返等属性
    - _Requirements: 13.3_

- [x] 14. 前端 API 服务测试实现
  - [x] 14.1 创建 API 服务单元测试
    - 创建 `admin-naive-ui/test/unit/service/auth.spec.ts`
    - 测试登录、获取用户信息等 API
    - _Requirements: 14.2, 14.3, 14.4_
  - [x] 14.2 编写 API 服务属性测试
    - 创建 `admin-naive-ui/test/unit/service/api.pbt.spec.ts`
    - **Property 7: API 服务正确性**
    - **Validates: Requirements 14.2, 14.3, 14.4, 14.5**

- [x] 15. Cypress E2E 测试配置
  - [x] 15.1 安装 Cypress 依赖
    - 安装 cypress
    - _Requirements: 12.1_
  - [x] 15.2 创建 Cypress 配置文件
    - 创建 `admin-naive-ui/cypress.config.ts`
    - 配置 baseUrl, viewport, video, screenshot
    - _Requirements: 12.3, 12.4_
  - [x] 15.3 创建 Cypress 支持文件
    - 创建 `admin-naive-ui/cypress/support/commands.ts`
    - 实现 login 等自定义命令
    - _Requirements: 12.2_
  - [x] 15.4 创建认证 E2E 测试
    - 创建 `admin-naive-ui/cypress/e2e/auth.cy.ts`
    - 测试登录、登出流程
    - _Requirements: 12.2, 12.6_

- [x] 16. 更新 package.json 测试脚本
  - [x] 16.1 更新后端测试脚本
    - 已有 test, test:cov, test:e2e, test:integration, test:all 脚本
    - _Requirements: 6.1_
  - [x] 16.2 更新前端测试脚本
    - 添加 test, test:cov, test:watch, test:ui 脚本
    - _Requirements: 6.1_

- [x] 17. Final Checkpoint - 完整测试验证
  - 后端测试基础设施已完成并验证通过
  - 前端测试基础设施已完成并验证通过
  - 覆盖率配置已完成
  - 所有任务已完成

## Notes

- All tasks are required for complete implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases

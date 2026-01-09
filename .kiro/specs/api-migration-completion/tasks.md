# Implementation Plan: API Migration Completion

## Overview

将前端所有页面直接使用 `@/service/api-gen` 生成的 API 函数，删除旧的 `@/service/api` 目录。

## Tasks

- [ ] 1. 迁移认证相关页面
  - [ ] 1.1 迁移 pwd-login.vue
    - 替换 `fetchCaptchaCode`, `fetchTenantList`, `fetchSocialAuthBinding` 为生成 API
    - _Requirements: 1.1, 1.2_
  - [ ] 1.2 迁移 register.vue
    - 替换 `fetchCaptchaCode`, `fetchRegister`, `fetchTenantList` 为生成 API
    - _Requirements: 1.3_
  - [ ] 1.3 迁移 social-callback/index.vue
    - 替换 `fetchSocialLoginCallback` 为生成 API
    - _Requirements: 1.4_
  - [ ] 1.4 迁移 store/modules/route/index.ts
    - 替换 `fetchGetRoutes` 为 `mainControllerGetRouters`
    - _Requirements: 1.5_

- [ ] 2. 迁移用户中心页面
  - [ ] 2.1 迁移 user-center/index.vue
    - 替换 `fetchUpdateUserPassword`, `fetchUpdateUserProfile` 为生成 API
    - _Requirements: 2.1_
  - [ ] 2.2 迁移 user-avatar.vue
    - 替换 `fetchUpdateUserAvatar` 为 `userControllerAvatar`
    - _Requirements: 2.2_
  - [ ] 2.3 迁移 social-card.vue
    - 替换社交绑定相关 API 为生成 API
    - _Requirements: 2.3_

- [ ] 3. 迁移系统管理页面
  - [ ] 3.1 迁移 user/index.vue 和 user-operate-drawer.vue
    - 替换用户管理相关 API 为生成 API
    - _Requirements: 3.1_
  - [ ] 3.2 迁移 user-password-drawer.vue
    - 替换 `fetchResetUserPassword` 为 `userControllerResetPwd`
    - _Requirements: 3.1_
  - [ ] 3.3 迁移 menu/index.vue 和 menu-operate-drawer.vue
    - 替换菜单管理相关 API 为生成 API
    - _Requirements: 3.2_
  - [ ] 3.4 迁移 menu-cascade-delete-modal.vue
    - 替换 `fetchCascadeDeleteMenu` 为生成 API
    - _Requirements: 3.2_
  - [ ] 3.5 迁移 role-operate-drawer.vue 和 role-auth-user-drawer.vue
    - 替换角色管理相关 API 为生成 API
    - _Requirements: 3.3_
  - [ ] 3.6 迁移 dict/index.vue
    - 替换 `fetchGetDictTypeOption`, `fetchRefreshCache` 为生成 API
    - _Requirements: 3.4_

- [ ] 4. 迁移公共组件
  - [ ] 4.1 迁移 tenant-select.vue
    - 替换 `fetchTenantList` 为生成 API
    - _Requirements: 4.1_
  - [ ] 4.2 迁移 post-select.vue
    - 替换 `fetchGetPostSelect` 为 `postControllerFindAll`
    - _Requirements: 4.2_
  - [ ] 4.3 迁移 user-select.vue
    - 替换 `fetchGetUserSelect` 为 `userControllerFindAll`
    - _Requirements: 4.3_
  - [ ] 4.4 迁移 menu-tree-select.vue 和 menu-tree.vue
    - 替换菜单树相关 API 为生成 API
    - _Requirements: 4.4, 4.5_
  - [ ] 4.5 迁移 role-select.vue
    - 替换 `fetchGetRoleSelect` 为 `roleControllerFindAll`
    - _Requirements: 4.5_
  - [ ] 4.6 迁移 dept-tree-select.vue
    - 替换 `fetchGetDeptTree` 为 `userControllerDeptTree`
    - _Requirements: 4.6_

- [ ] 5. 迁移业务 Hook
  - [ ] 5.1 迁移 hooks/business/dict.ts
    - 替换 `fetchGetDictDataByType` 为 `dictControllerFindOneDataType`
    - _Requirements: 5.1_

- [ ] 6. 迁移文件管理模块
  - [ ] 6.1 迁移 file-manager/index.vue
    - 替换文件操作相关 API 为生成 API
    - _Requirements: 6.1_
  - [ ] 6.2 迁移 file-manager 子组件
    - 迁移 folder-modal.vue, batch-share-modal.vue, file-share-modal.vue
    - 迁移 move-file-modal.vue, file-upload-modal.vue
    - 迁移 file-version-modal.vue, recycle-bin.vue, storage-stats.vue
    - _Requirements: 6.2_

- [ ] 7. 迁移工具模块
  - [ ] 7.1 迁移 gen-table-operate-drawer.vue
    - 替换 `fetchGetDictTypeOption` 为 `dictControllerFindOptionselect`
    - _Requirements: 3.4_

- [ ] 8. Checkpoint - 验证迁移完成
  - 运行 grep 检查无旧 API 导入
  - 运行 TypeScript 类型检查
  - 如有问题请询问用户

- [ ] 9. 清理旧代码
  - [ ] 9.1 删除 @/service/api 目录
    - 确认无引用后删除整个目录
    - _Requirements: 7.1, 7.2_
  - [ ] 9.2 最终验证
    - 运行 `pnpm typecheck` 确保无类型错误
    - _Requirements: 7.3_

## Notes

- 部分 API（如 tenant、social、file-manager 相关）可能在生成的 API 中不存在，需要先检查 OpenAPI 规范是否包含这些接口
- 如果生成的 API 缺少某些接口，需要先更新后端 OpenAPI 规范并重新生成
- 迁移时注意响应数据结构的变化，生成的 API 返回 `response.data`


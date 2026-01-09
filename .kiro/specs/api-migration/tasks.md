# Tasks

## Task 1: 迁移认证模块 (auth)

- [x] 1.1 迁移 `store/modules/auth/index.ts` - 登录、登出、获取用户信息
- [x] 1.2 迁移 `store/modules/route/index.ts` - 获取路由
- [x] 1.3 迁移 `views/_builtin/login/modules/pwd-login.vue` - 密码登录
- [x] 1.4 迁移 `views/_builtin/login/modules/register.vue` - 注册
- [x] 1.5 迁移 `views/_builtin/social-callback/index.vue` - 社交登录回调

**Requirements Addressed:** Requirement 1

## Task 2: 迁移系统管理模块 - 用户管理

- [x] 2.1 迁移 `views/system/user/index.vue` - 用户列表
- [x] 2.2 迁移 `views/system/user/modules/user-operate-drawer.vue` - 用户操作
- [x] 2.3 迁移 `views/_builtin/user-center/index.vue` - 个人中心
- [x] 2.4 迁移 `views/_builtin/user-center/modules/user-avatar.vue` - 头像上传
- [x] 2.5 迁移 `views/_builtin/user-center/modules/online-table.vue` - 在线设备

**Requirements Addressed:** Requirement 2

## Task 3: 迁移系统管理模块 - 角色管理

- [x] 3.1 迁移 `views/system/role/index.vue` - 角色列表
- [x] 3.2 迁移 `views/system/role/modules/role-operate-drawer.vue` - 角色操作
- [x] 3.3 迁移 `views/system/role/modules/role-auth-drawer.vue` - 角色授权

**Requirements Addressed:** Requirement 2

## Task 4: 迁移系统管理模块 - 菜单管理

- [x] 4.1 迁移 `views/system/menu/index.vue` - 菜单列表
- [x] 4.2 迁移 `views/system/menu/modules/menu-operate-drawer.vue` - 菜单操作

**Requirements Addressed:** Requirement 2

## Task 5: 迁移系统管理模块 - 部门管理

- [x] 5.1 迁移 `views/system/dept/index.vue` - 部门列表
- [x] 5.2 迁移 `views/system/dept/modules/dept-operate-drawer.vue` - 部门操作

**Requirements Addressed:** Requirement 2

## Task 6: 迁移系统管理模块 - 字典管理

- [x] 6.1 迁移 `views/system/dict/index.vue` - 字典列表
- [x] 6.2 迁移 `views/system/dict/modules/dict-type-operate-drawer.vue` - 字典类型操作
- [x] 6.3 迁移 `views/system/dict/modules/dict-data-operate-drawer.vue` - 字典数据操作

**Requirements Addressed:** Requirement 2

## Task 7: 迁移系统管理模块 - 参数配置

- [x] 7.1 迁移 `views/system/config/index.vue` - 参数列表
- [x] 7.2 迁移 `views/system/config/modules/config-operate-drawer.vue` - 参数操作

**Requirements Addressed:** Requirement 2

## Task 8: 迁移系统管理模块 - 通知公告

- [x] 8.1 迁移 `views/system/notice/index.vue` - 通知列表
- [x] 8.2 迁移 `views/system/notice/modules/notice-operate-drawer.vue` - 通知操作

**Requirements Addressed:** Requirement 2

## Task 9: 迁移系统管理模块 - 岗位管理

- [x] 9.1 迁移 `views/system/post/index.vue` - 岗位列表
- [x] 9.2 迁移 `views/system/post/modules/post-operate-drawer.vue` - 岗位操作

**Requirements Addressed:** Requirement 2

## Task 10: 迁移监控模块 - 定时任务

- [x] 10.1 迁移 `views/monitor/job/index.vue` - 任务列表
- [x] 10.2 迁移 `views/monitor/job/modules/job-operate-drawer.vue` - 任务操作
- [x] 10.3 迁移 `views/monitor/job-log/index.vue` - 任务日志

**Requirements Addressed:** Requirement 3

## Task 11: 迁移监控模块 - 日志管理

- [x] 11.1 迁移 `views/monitor/operlog/index.vue` - 操作日志
- [x] 11.2 迁移 `views/monitor/logininfor/index.vue` - 登录日志

**Requirements Addressed:** Requirement 3

## Task 12: 迁移监控模块 - 在线用户

- [x] 12.1 迁移 `views/monitor/online/index.vue` - 在线用户列表

**Requirements Addressed:** Requirement 3

## Task 13: 迁移监控模块 - 缓存监控

- [x] 13.1 迁移 `views/monitor/cache/index.vue` - 缓存信息
- [x] 13.2 迁移 `views/monitor/cache/list/index.vue` - 缓存列表

**Requirements Addressed:** Requirement 3

## Task 14: 迁移监控模块 - 服务监控

- [x] 14.1 迁移 `views/monitor/server/index.vue` - 服务器信息

**Requirements Addressed:** Requirement 3

## Task 15: 迁移工具模块 - 代码生成

- [x] 15.1 迁移 `views/tool/gen/index.vue` - 代码生成列表
- [x] 15.2 迁移 `views/tool/gen/modules/gen-table-operate-drawer.vue` - 表配置
- [x] 15.3 迁移 `views/tool/gen/modules/gen-table-preview-drawer.vue` - 代码预览
- [x] 15.4 迁移 `views/tool/gen/modules/gen-table-import-drawer.vue` - 导入表

**Requirements Addressed:** Requirement 4

## Task 16: 清理旧代码（暂缓）

- [ ] 16.1 确认所有页面迁移完成
- [ ] 16.2 删除或标记废弃 `@/service/api` 目录
- [ ] 16.3 更新文档

**Requirements Addressed:** Requirement 5

**注意:** 部分 API（如 tenant、client、oss、sms、file-manager、social 等）在当前生成的 API 中不存在，需要先更新 OpenAPI 规范或保留旧 API。

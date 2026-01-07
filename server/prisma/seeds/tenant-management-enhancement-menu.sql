-- Tenant Management Enhancement Menu Seed Data
-- This SQL file adds menus for SMS Management, Notify Management, and Tenant Enhancement

-- ==================== SMS Management ====================
-- SMS Management Parent Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2000, '000000', '短信管理', 1, 12, 'sms', '', '', '1', '0', 'M', '0', '0', '', 'message', 'admin', NOW(), '', NULL, '短信管理目录', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- SMS Channel Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2001, '000000', '短信渠道', 2000, 1, 'sms-channel', 'system/sms/channel/index', '', '1', '0', 'C', '0', '0', 'system:sms:channel:list', 'phone', 'admin', NOW(), '', NULL, '短信渠道菜单', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- SMS Template Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2002, '000000', '短信模板', 2000, 2, 'sms-template', 'system/sms/template/index', '', '1', '0', 'C', '0', '0', 'system:sms:template:list', 'documentation', 'admin', NOW(), '', NULL, '短信模板菜单', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- SMS Log Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2003, '000000', '短信日志', 2000, 3, 'sms-log', 'system/sms/log/index', '', '1', '0', 'C', '0', '0', 'system:sms:log:list', 'log', 'admin', NOW(), '', NULL, '短信日志菜单', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- SMS Channel Button Permissions
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2010, '000000', '短信渠道查询', 2001, 1, '', '', '', '1', '0', 'F', '0', '0', 'system:sms:channel:query', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2011, '000000', '短信渠道新增', 2001, 2, '', '', '', '1', '0', 'F', '0', '0', 'system:sms:channel:add', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2012, '000000', '短信渠道修改', 2001, 3, '', '', '', '1', '0', 'F', '0', '0', 'system:sms:channel:edit', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2013, '000000', '短信渠道删除', 2001, 4, '', '', '', '1', '0', 'F', '0', '0', 'system:sms:channel:remove', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

-- SMS Template Button Permissions
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2020, '000000', '短信模板查询', 2002, 1, '', '', '', '1', '0', 'F', '0', '0', 'system:sms:template:query', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2021, '000000', '短信模板新增', 2002, 2, '', '', '', '1', '0', 'F', '0', '0', 'system:sms:template:add', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2022, '000000', '短信模板修改', 2002, 3, '', '', '', '1', '0', 'F', '0', '0', 'system:sms:template:edit', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2023, '000000', '短信模板删除', 2002, 4, '', '', '', '1', '0', 'F', '0', '0', 'system:sms:template:remove', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

-- SMS Log Button Permissions
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2030, '000000', '短信日志查询', 2003, 1, '', '', '', '1', '0', 'F', '0', '0', 'system:sms:log:query', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2031, '000000', '短信日志删除', 2003, 2, '', '', '', '1', '0', 'F', '0', '0', 'system:sms:log:remove', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

-- ==================== Notify Management ====================
-- Notify Management Parent Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2100, '000000', '站内信管理', 1, 13, 'notify', '', '', '1', '0', 'M', '0', '0', '', 'email', 'admin', NOW(), '', NULL, '站内信管理目录', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- Notify Template Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2101, '000000', '站内信模板', 2100, 1, 'notify-template', 'system/notify/template/index', '', '1', '0', 'C', '0', '0', 'system:notify:template:list', 'documentation', 'admin', NOW(), '', NULL, '站内信模板菜单', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- Notify Message Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2102, '000000', '站内信消息', 2100, 2, 'notify-message', 'system/notify/message/index', '', '1', '0', 'C', '0', '0', 'system:notify:message:list', 'message', 'admin', NOW(), '', NULL, '站内信消息菜单', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- Notify Template Button Permissions
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2110, '000000', '站内信模板查询', 2101, 1, '', '', '', '1', '0', 'F', '0', '0', 'system:notify:template:query', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2111, '000000', '站内信模板新增', 2101, 2, '', '', '', '1', '0', 'F', '0', '0', 'system:notify:template:add', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2112, '000000', '站内信模板修改', 2101, 3, '', '', '', '1', '0', 'F', '0', '0', 'system:notify:template:edit', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2113, '000000', '站内信模板删除', 2101, 4, '', '', '', '1', '0', 'F', '0', '0', 'system:notify:template:remove', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

-- Notify Message Button Permissions
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2120, '000000', '站内信消息查询', 2102, 1, '', '', '', '1', '0', 'F', '0', '0', 'system:notify:message:query', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2121, '000000', '站内信消息发送', 2102, 2, '', '', '', '1', '0', 'F', '0', '0', 'system:notify:message:send', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2122, '000000', '站内信消息删除', 2102, 3, '', '', '', '1', '0', 'F', '0', '0', 'system:notify:message:remove', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

-- ==================== Tenant Enhancement ====================
-- Tenant Enhancement Parent Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2200, '000000', '租户增强', 1, 14, 'tenant-enhance', '', '', '1', '0', 'M', '0', '0', '', 'peoples', 'admin', NOW(), '', NULL, '租户增强目录', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- Tenant Dashboard Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2201, '000000', '租户仪表盘', 2200, 1, 'tenant-dashboard', 'system/tenant-dashboard/index', '', '1', '0', 'C', '0', '0', 'system:tenant:dashboard:list', 'dashboard', 'admin', NOW(), '', NULL, '租户仪表盘菜单', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- Tenant Quota Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2202, '000000', '租户配额', 2200, 2, 'tenant-quota', 'system/tenant-quota/index', '', '1', '0', 'C', '0', '0', 'system:tenant:quota:list', 'chart', 'admin', NOW(), '', NULL, '租户配额菜单', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- Tenant Audit Menu
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2203, '000000', '租户审计日志', 2200, 3, 'tenant-audit', 'system/tenant-audit/index', '', '1', '0', 'C', '0', '0', 'system:tenant:audit:list', 'log', 'admin', NOW(), '', NULL, '租户审计日志菜单', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, parent_id = EXCLUDED.parent_id, order_num = EXCLUDED.order_num, path = EXCLUDED.path, component = EXCLUDED.component, perms = EXCLUDED.perms, icon = EXCLUDED.icon, update_time = NOW();

-- Tenant Dashboard Button Permissions
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2210, '000000', '租户仪表盘查看', 2201, 1, '', '', '', '1', '0', 'F', '0', '0', 'system:tenant:dashboard:view', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

-- Tenant Quota Button Permissions
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2220, '000000', '租户配额查询', 2202, 1, '', '', '', '1', '0', 'F', '0', '0', 'system:tenant:quota:query', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2221, '000000', '租户配额修改', 2202, 2, '', '', '', '1', '0', 'F', '0', '0', 'system:tenant:quota:edit', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

-- Tenant Audit Button Permissions
INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2230, '000000', '租户审计日志查询', 2203, 1, '', '', '', '1', '0', 'F', '0', '0', 'system:tenant:audit:query', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

INSERT INTO sys_menu (menu_id, tenant_id, menu_name, parent_id, order_num, path, component, query, is_frame, is_cache, menu_type, visible, status, perms, icon, create_by, create_time, update_by, update_time, remark, del_flag)
VALUES (2231, '000000', '租户审计日志导出', 2203, 2, '', '', '', '1', '0', 'F', '0', '0', 'system:tenant:audit:export', '#', 'admin', NOW(), '', NULL, '', '0')
ON CONFLICT (menu_id) DO UPDATE SET menu_name = EXCLUDED.menu_name, perms = EXCLUDED.perms, update_time = NOW();

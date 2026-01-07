import { request } from '@/service/request';

// ==================== 租户基础管理 API ====================

/** 获取租户列表 */
export function fetchGetTenantList(params?: Api.System.TenantSearchParams) {
  return request<Api.System.TenantList>({
    url: '/system/tenant/list',
    method: 'get',
    params,
  });
}

/** 新增租户 */
export function fetchCreateTenant(data: Api.System.TenantOperateParams) {
  return request<boolean>({
    url: '/system/tenant',
    method: 'post',
    headers: {
      isEncrypt: true,
      repeatSubmit: false,
    },
    data,
  });
}

/** 修改租户 */
export function fetchUpdateTenant(data: Api.System.TenantOperateParams) {
  return request<boolean>({
    url: '/system/tenant',
    method: 'put',
    data,
  });
}

/** 批量删除租户 */
export function fetchBatchDeleteTenant(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/tenant/${ids.join(',')}`,
    method: 'delete',
  });
}

/** 同步租户字典 */
export function fetchSyncTenantDict() {
  return request<boolean>({
    url: '/system/tenant/syncTenantDict',
    method: 'get',
  });
}

/** 同步租户套餐 */
export function fetchSyncTenantPackage(params: Api.System.TenantPackageSyncParams) {
  return request<boolean>({
    url: '/system/tenant/syncTenantPackage',
    method: 'get',
    params,
  });
}

/** 同步租户参数配置 */
export function fetchSyncTenantConfig() {
  return request<boolean>({
    url: '/system/tenant/syncTenantConfig',
    method: 'get',
  });
}

/** 动态切换租户 */
export function fetchChangeTenant(tenantId: CommonType.IdType) {
  return request<boolean>({
    url: `/system/tenant/dynamic/${tenantId}`,
    method: 'get',
  });
}

/** 清空租户 */
export function fetchClearTenant() {
  return request<boolean>({
    url: '/system/tenant/dynamic/clear',
    method: 'get',
  });
}


// ==================== 租户仪表盘 API ====================

/** 获取仪表盘统计数据 */
export function fetchGetDashboardStats() {
  return request<Api.System.TenantDashboardStats>({
    url: '/system/tenant/dashboard/stats',
    method: 'get',
  });
}

/** 获取租户增长趋势 */
export function fetchGetDashboardTrend(params?: Api.System.DashboardTimeRangeParams) {
  return request<Api.System.TenantTrendData[]>({
    url: '/system/tenant/dashboard/trend',
    method: 'get',
    params,
  });
}

/** 获取套餐分布 */
export function fetchGetPackageDistribution() {
  return request<Api.System.PackageDistribution[]>({
    url: '/system/tenant/dashboard/package-distribution',
    method: 'get',
  });
}

/** 获取即将到期租户 */
export function fetchGetExpiringTenants(days?: number) {
  return request<Api.System.ExpiringTenant[]>({
    url: '/system/tenant/dashboard/expiring-tenants',
    method: 'get',
    params: { days },
  });
}

/** 获取配额使用TOP10 */
export function fetchGetQuotaTopTenants() {
  return request<Api.System.QuotaTopTenant[]>({
    url: '/system/tenant/dashboard/quota-top',
    method: 'get',
  });
}

/** 获取仪表盘完整数据 */
export function fetchGetDashboardData(params?: Api.System.DashboardTimeRangeParams) {
  return request<Api.System.TenantDashboardData>({
    url: '/system/tenant/dashboard',
    method: 'get',
    params,
  });
}

// ==================== 租户配额管理 API ====================

/** 获取租户配额列表 */
export function fetchGetTenantQuotaList(params?: Api.System.TenantQuotaSearchParams) {
  return request<Api.System.TenantQuotaList>({
    url: '/system/tenant/quota/list',
    method: 'get',
    params,
  });
}

/** 获取租户配额详情 */
export function fetchGetTenantQuotaDetail(tenantId: string) {
  return request<Api.System.TenantQuotaDetail>({
    url: `/system/tenant/quota/${tenantId}`,
    method: 'get',
  });
}

/** 更新租户配额 */
export function fetchUpdateTenantQuota(data: Api.System.UpdateTenantQuotaParams) {
  return request<boolean>({
    url: '/system/tenant/quota',
    method: 'put',
    data,
  });
}

/** 检查配额 */
export function fetchCheckQuota(data: Api.System.CheckQuotaParams) {
  return request<Api.System.QuotaCheckResult>({
    url: '/system/tenant/quota/check',
    method: 'post',
    data,
  });
}

// ==================== 租户审计日志 API ====================

/** 获取审计日志列表 */
export function fetchGetTenantAuditLogList(params?: Api.System.TenantAuditLogSearchParams) {
  return request<Api.System.TenantAuditLogList>({
    url: '/system/tenant/audit/list',
    method: 'get',
    params,
  });
}

/** 获取审计日志详情 */
export function fetchGetTenantAuditLogDetail(id: number | string) {
  return request<Api.System.TenantAuditLogDetail>({
    url: `/system/tenant/audit/${id}`,
    method: 'get',
  });
}

/** 获取审计日志统计 */
export function fetchGetTenantAuditLogStats(tenantId?: string) {
  return request<Api.System.TenantAuditLogStats>({
    url: '/system/tenant/audit/stats/summary',
    method: 'get',
    params: { tenantId },
  });
}

/** 导出审计日志 */
export function fetchExportTenantAuditLog(data: Api.System.ExportTenantAuditLogParams) {
  return request({
    url: '/system/tenant/audit/export',
    method: 'post',
    data,
    responseType: 'blob',
  });
}

// ==================== 租户切换 API ====================

/** 获取可切换租户列表 */
export function fetchGetTenantSelectList() {
  return request<Api.System.TenantSelectItem[]>({
    url: '/system/tenant/select-list',
    method: 'get',
  });
}

/** 切换租户 */
export function fetchSwitchTenant(tenantId: string) {
  return request<Api.System.TenantSwitchResponse>({
    url: `/system/tenant/dynamic/${tenantId}`,
    method: 'get',
  });
}

/** 恢复原租户 */
export function fetchRestoreTenant() {
  return request<Api.System.TenantRestoreResponse>({
    url: '/system/tenant/dynamic/clear',
    method: 'get',
  });
}

/** 获取租户切换状态 */
export function fetchGetTenantSwitchStatus() {
  return request<Api.System.TenantSwitchStatus>({
    url: '/system/tenant/switch-status',
    method: 'get',
  });
}

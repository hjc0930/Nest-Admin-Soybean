/**
 * Namespace Api - Tenant Enhancement Types
 *
 * 租户增强功能类型定义
 */
declare namespace Api {
  namespace System {
    // ==================== 租户仪表盘类型 ====================

    /** 租户统计卡片数据 */
    type TenantDashboardStats = {
      /** 租户总数 */
      totalTenants: number;
      /** 活跃租户数 */
      activeTenants: number;
      /** 新增租户数（本月） */
      newTenants: number;
      /** 用户总数 */
      totalUsers: number;
      /** 在线用户数 */
      onlineUsers: number;
      /** 今日登录用户数 */
      todayLoginUsers: number;
      /** 存储使用总量（MB） */
      totalStorageUsed: number;
      /** API调用总量（今日） */
      totalApiCalls: number;
    };

    /** 租户增长趋势数据点 */
    type TenantTrendData = {
      /** 日期 */
      date: string;
      /** 新增租户数 */
      newTenants: number;
      /** 累计租户数 */
      totalTenants: number;
    };

    /** 套餐分布数据 */
    type PackageDistribution = {
      /** 套餐ID */
      packageId: number;
      /** 套餐名称 */
      packageName: string;
      /** 租户数量 */
      count: number;
      /** 占比 */
      percentage: number;
    };

    /** 即将到期租户 */
    type ExpiringTenant = {
      /** 租户ID */
      tenantId: string;
      /** 企业名称 */
      companyName: string;
      /** 联系人 */
      contactUserName: string;
      /** 联系电话 */
      contactPhone: string;
      /** 到期时间 */
      expireTime: string;
      /** 剩余天数 */
      daysRemaining: number;
      /** 套餐名称 */
      packageName: string;
    };

    /** 配额使用TOP租户 */
    type QuotaTopTenant = {
      /** 租户ID */
      tenantId: string;
      /** 企业名称 */
      companyName: string;
      /** 用户配额使用率 */
      userQuotaUsage: number;
      /** 存储配额使用率 */
      storageQuotaUsage: number;
      /** API配额使用率 */
      apiQuotaUsage: number;
      /** 综合使用率 */
      overallUsage: number;
    };

    /** 仪表盘完整数据 */
    type TenantDashboardData = {
      /** 统计卡片数据 */
      stats: TenantDashboardStats;
      /** 租户增长趋势 */
      trend: TenantTrendData[];
      /** 套餐分布 */
      packageDistribution: PackageDistribution[];
      /** 即将到期租户 */
      expiringTenants: ExpiringTenant[];
      /** 配额使用TOP10 */
      quotaTopTenants: QuotaTopTenant[];
    };

    /** 仪表盘时间范围查询参数 */
    type DashboardTimeRangeParams = {
      beginTime?: string;
      endTime?: string;
    };

    // ==================== 租户配额类型 ====================

    /** 配额状态 */
    type QuotaStatus = 'normal' | 'warning' | 'danger';

    /** 租户配额 */
    type TenantQuota = Common.CommonRecord<{
      /** 配额记录ID */
      id: number;
      /** 租户ID */
      tenantId: string;
      /** 企业名称 */
      companyName: string;
      /** 用户数量配额，-1表示不限 */
      userQuota: number;
      /** 已使用用户数 */
      userUsed: number;
      /** 用户配额使用率 */
      userUsageRate: number;
      /** 存储配额（MB），-1表示不限 */
      storageQuota: number;
      /** 已使用存储（MB） */
      storageUsed: number;
      /** 存储配额使用率 */
      storageUsageRate: number;
      /** API调用配额（月），-1表示不限 */
      apiQuota: number;
      /** 本月已调用次数 */
      apiUsed: number;
      /** API配额使用率 */
      apiUsageRate: number;
      /** 配额状态 */
      status: QuotaStatus;
    }>;

    /** 配额变更记录 */
    type QuotaChangeRecord = {
      /** 记录ID */
      id: number;
      /** 配额类型 */
      quotaType: 'user' | 'storage' | 'api';
      /** 原值 */
      oldValue: number;
      /** 新值 */
      newValue: number;
      /** 修改人 */
      changeBy: string;
      /** 修改时间 */
      changeTime: string;
    };

    /** 租户配额详情 */
    type TenantQuotaDetail = TenantQuota & {
      /** 配额变更历史 */
      quotaHistory: QuotaChangeRecord[];
    };

    /** 配额搜索参数 */
    type TenantQuotaSearchParams = CommonType.RecordNullable<{
      tenantId?: string;
      companyName?: string;
      status?: QuotaStatus;
    }> &
      Common.CommonSearchParams;

    /** 配额更新参数 */
    type UpdateTenantQuotaParams = {
      tenantId: string;
      userQuota?: number;
      storageQuota?: number;
      apiQuota?: number;
    };

    /** 配额检查参数 */
    type CheckQuotaParams = {
      tenantId: string;
      quotaType: 'user' | 'storage' | 'api';
      requestAmount?: number;
    };

    /** 配额检查结果 */
    type QuotaCheckResult = {
      /** 是否允许 */
      allowed: boolean;
      /** 配额类型 */
      quotaType: string;
      /** 当前使用量 */
      used: number;
      /** 配额限制 */
      limit: number;
      /** 使用率 */
      usageRate: number;
      /** 提示信息 */
      message: string;
    };

    /** 配额列表 */
    type TenantQuotaList = Common.PaginatingQueryRecord<TenantQuota>;

    // ==================== 租户审计日志类型 ====================

    /** 审计操作类型 */
    type AuditActionType =
      | 'login'
      | 'logout'
      | 'create'
      | 'update'
      | 'delete'
      | 'permission_change'
      | 'config_change'
      | 'export'
      | 'other';

    /** 租户审计日志 */
    type TenantAuditLog = Common.CommonRecord<{
      /** 日志ID */
      id: number | string;
      /** 租户ID */
      tenantId: string;
      /** 企业名称 */
      companyName?: string;
      /** 操作人ID */
      operatorId: number;
      /** 操作人姓名 */
      operatorName: string;
      /** 操作类型 */
      actionType: AuditActionType;
      /** 操作描述 */
      actionDesc: string;
      /** 操作模块 */
      module: string;
      /** IP地址 */
      ipAddress: string;
      /** User Agent */
      userAgent?: string;
      /** 请求URL */
      requestUrl?: string;
      /** 请求方法 */
      requestMethod?: string;
      /** 操作时间 */
      operateTime: string;
    }>;

    /** 审计日志详情 */
    type TenantAuditLogDetail = TenantAuditLog & {
      /** 请求参数（JSON） */
      requestParams?: string;
      /** 操作前数据（JSON） */
      beforeData?: string;
      /** 操作后数据（JSON） */
      afterData?: string;
      /** 响应数据（JSON） */
      responseData?: string;
    };

    /** 审计日志搜索参数 */
    type TenantAuditLogSearchParams = CommonType.RecordNullable<{
      tenantId?: string;
      operatorName?: string;
      actionType?: AuditActionType;
      module?: string;
      beginTime?: string;
      endTime?: string;
    }> &
      Common.CommonSearchParams;

    /** 审计日志导出参数 */
    type ExportTenantAuditLogParams = TenantAuditLogSearchParams;

    /** 审计日志统计 */
    type TenantAuditLogStats = {
      /** 今日操作数 */
      todayCount: number;
      /** 本周操作数 */
      weekCount: number;
      /** 本月操作数 */
      monthCount: number;
      /** 按操作类型统计 */
      byActionType: { actionType: string; count: number }[];
      /** 按模块统计 */
      byModule: { module: string; count: number }[];
    };

    /** 审计日志列表 */
    type TenantAuditLogList = Common.PaginatingQueryRecord<TenantAuditLog>;

    // ==================== 租户切换类型 ====================

    /** 可切换租户选项 */
    type TenantSelectItem = {
      /** 租户ID */
      tenantId: string;
      /** 企业名称 */
      companyName: string;
      /** 状态 */
      status: string;
    };

    /** 租户切换响应 */
    type TenantSwitchResponse = {
      /** 是否成功 */
      success: boolean;
      /** 租户ID */
      tenantId: string;
      /** 企业名称 */
      companyName: string;
    };

    /** 租户恢复响应 */
    type TenantRestoreResponse = {
      /** 是否成功 */
      success: boolean;
      /** 原租户ID */
      originalTenantId: string;
    };

    /** 租户切换状态 */
    type TenantSwitchStatus = {
      /** 是否已切换 */
      isSwitched: boolean;
      /** 当前租户ID */
      currentTenantId: string;
      /** 当前企业名称 */
      currentCompanyName?: string;
      /** 原租户ID */
      originalTenantId?: string;
    };
  }
}

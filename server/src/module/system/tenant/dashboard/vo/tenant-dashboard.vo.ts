import { ApiProperty } from '@nestjs/swagger';

/**
 * 租户统计卡片VO
 */
export class TenantStatsVo {
  @ApiProperty({ description: '租户总数' })
  totalTenants: number;

  @ApiProperty({ description: '活跃租户数' })
  activeTenants: number;

  @ApiProperty({ description: '新增租户数（本月）' })
  newTenants: number;

  @ApiProperty({ description: '用户总数' })
  totalUsers: number;

  @ApiProperty({ description: '在线用户数' })
  onlineUsers: number;

  @ApiProperty({ description: '今日登录用户数' })
  todayLoginUsers: number;

  @ApiProperty({ description: '存储使用总量（MB）' })
  totalStorageUsed: number;

  @ApiProperty({ description: 'API调用总量（今日）' })
  totalApiCalls: number;
}

/**
 * 租户增长趋势数据点
 */
export class TenantTrendDataVo {
  @ApiProperty({ description: '日期' })
  date: string;

  @ApiProperty({ description: '新增租户数' })
  newTenants: number;

  @ApiProperty({ description: '累计租户数' })
  totalTenants: number;
}

/**
 * 套餐分布数据
 */
export class PackageDistributionVo {
  @ApiProperty({ description: '套餐ID' })
  packageId: number;

  @ApiProperty({ description: '套餐名称' })
  packageName: string;

  @ApiProperty({ description: '租户数量' })
  count: number;

  @ApiProperty({ description: '占比' })
  percentage: number;
}

/**
 * 即将到期租户
 */
export class ExpiringTenantVo {
  @ApiProperty({ description: '租户ID' })
  tenantId: string;

  @ApiProperty({ description: '企业名称' })
  companyName: string;

  @ApiProperty({ description: '联系人' })
  contactUserName: string;

  @ApiProperty({ description: '联系电话' })
  contactPhone: string;

  @ApiProperty({ description: '到期时间' })
  expireTime: Date;

  @ApiProperty({ description: '剩余天数' })
  daysRemaining: number;

  @ApiProperty({ description: '套餐名称' })
  packageName: string;
}

/**
 * 配额使用TOP租户
 */
export class QuotaTopTenantVo {
  @ApiProperty({ description: '租户ID' })
  tenantId: string;

  @ApiProperty({ description: '企业名称' })
  companyName: string;

  @ApiProperty({ description: '用户配额使用率' })
  userQuotaUsage: number;

  @ApiProperty({ description: '存储配额使用率' })
  storageQuotaUsage: number;

  @ApiProperty({ description: 'API配额使用率' })
  apiQuotaUsage: number;

  @ApiProperty({ description: '综合使用率' })
  overallUsage: number;
}

/**
 * 仪表盘完整数据VO
 */
export class DashboardDataVo {
  @ApiProperty({ description: '统计卡片数据', type: TenantStatsVo })
  stats: TenantStatsVo;

  @ApiProperty({ description: '租户增长趋势', type: [TenantTrendDataVo] })
  trend: TenantTrendDataVo[];

  @ApiProperty({ description: '套餐分布', type: [PackageDistributionVo] })
  packageDistribution: PackageDistributionVo[];

  @ApiProperty({ description: '即将到期租户', type: [ExpiringTenantVo] })
  expiringTenants: ExpiringTenantVo[];

  @ApiProperty({ description: '配额使用TOP10', type: [QuotaTopTenantVo] })
  quotaTopTenants: QuotaTopTenantVo[];
}

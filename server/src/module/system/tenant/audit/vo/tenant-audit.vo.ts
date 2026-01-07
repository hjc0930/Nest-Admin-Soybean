import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditActionType } from '../dto/tenant-audit.dto';

/**
 * 租户审计日志VO
 * Requirements: 6.1, 6.2
 */
export class TenantAuditLogVo {
  @ApiProperty({ description: '日志ID' })
  id: bigint | number;

  @ApiProperty({ description: '租户ID' })
  tenantId: string;

  @ApiPropertyOptional({ description: '企业名称' })
  companyName?: string;

  @ApiProperty({ description: '操作人ID' })
  operatorId: number;

  @ApiProperty({ description: '操作人姓名' })
  operatorName: string;

  @ApiProperty({ description: '操作类型', enum: AuditActionType })
  actionType: string;

  @ApiProperty({ description: '操作描述' })
  actionDesc: string;

  @ApiProperty({ description: '操作模块' })
  module: string;

  @ApiProperty({ description: 'IP地址' })
  ipAddress: string;

  @ApiPropertyOptional({ description: 'User Agent' })
  userAgent?: string;

  @ApiPropertyOptional({ description: '请求URL' })
  requestUrl?: string;

  @ApiPropertyOptional({ description: '请求方法' })
  requestMethod?: string;

  @ApiProperty({ description: '操作时间' })
  operateTime: Date;
}

/**
 * 租户审计日志详情VO
 * Requirements: 6.3
 */
export class TenantAuditLogDetailVo extends TenantAuditLogVo {
  @ApiPropertyOptional({ description: '请求参数（JSON）' })
  requestParams?: string;

  @ApiPropertyOptional({ description: '操作前数据（JSON）' })
  beforeData?: string;

  @ApiPropertyOptional({ description: '操作后数据（JSON）' })
  afterData?: string;

  @ApiPropertyOptional({ description: '响应数据（JSON）' })
  responseData?: string;
}

/**
 * 审计日志列表响应VO
 */
export class TenantAuditLogListVo {
  @ApiProperty({ description: '日志列表', type: [TenantAuditLogVo] })
  rows: TenantAuditLogVo[];

  @ApiProperty({ description: '总数' })
  total: number;
}

/**
 * 审计日志统计VO
 */
export class TenantAuditLogStatsVo {
  @ApiProperty({ description: '今日操作数' })
  todayCount: number;

  @ApiProperty({ description: '本周操作数' })
  weekCount: number;

  @ApiProperty({ description: '本月操作数' })
  monthCount: number;

  @ApiProperty({ description: '按操作类型统计' })
  byActionType: { actionType: string; count: number }[];

  @ApiProperty({ description: '按模块统计' })
  byModule: { module: string; count: number }[];
}

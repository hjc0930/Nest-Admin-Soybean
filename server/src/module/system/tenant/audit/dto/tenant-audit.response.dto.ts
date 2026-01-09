import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/shared/dto/base.response.dto';
import { DateFormat } from 'src/shared/decorators';

/**
 * 租户审计日志响应 DTO
 */
export class TenantAuditLogResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '日志ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '租户ID' })
  @Expose()
  override tenantId: number;

  @ApiProperty({ description: '企业名称' })
  @Expose()
  companyName: string;

  @ApiProperty({ description: '操作人ID' })
  @Expose()
  operatorId: number;

  @ApiProperty({ description: '操作人名称' })
  @Expose()
  operatorName: string;

  @ApiProperty({ description: '操作类型' })
  @Expose()
  actionType: string;

  @ApiProperty({ description: '操作描述' })
  @Expose()
  actionDesc: string;

  @ApiProperty({ description: '模块' })
  @Expose()
  module: string;

  @ApiProperty({ description: 'IP地址' })
  @Expose()
  ipAddress: string;

  @ApiPropertyOptional({ description: '用户代理' })
  @Expose()
  userAgent?: string;

  @ApiPropertyOptional({ description: '请求URL' })
  @Expose()
  requestUrl?: string;

  @ApiPropertyOptional({ description: '请求方法' })
  @Expose()
  requestMethod?: string;

  @ApiProperty({ description: '操作时间' })
  @Expose()
  @DateFormat()
  operateTime: string;
}

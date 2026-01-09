import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/shared/dto/base.response.dto';
import { DateFormat } from 'src/shared/decorators';
import { QuotaStatus } from '../vo/tenant-quota.vo';

/**
 * 租户配额响应 DTO
 */
export class TenantQuotaResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '配额记录ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '租户ID' })
  @Expose()
  override tenantId: number;

  @ApiProperty({ description: '企业名称' })
  @Expose()
  companyName: string;

  @ApiProperty({ description: '用户数量配额，-1表示不限' })
  @Expose()
  userQuota: number;

  @ApiProperty({ description: '已使用用户数' })
  @Expose()
  userUsed: number;

  @ApiProperty({ description: '用户配额使用率' })
  @Expose()
  userUsageRate: number;

  @ApiProperty({ description: '存储配额（MB），-1表示不限' })
  @Expose()
  storageQuota: number;

  @ApiProperty({ description: '已使用存储（MB）' })
  @Expose()
  storageUsed: number;

  @ApiProperty({ description: '存储配额使用率' })
  @Expose()
  storageUsageRate: number;

  @ApiProperty({ description: 'API调用配额（月），-1表示不限' })
  @Expose()
  apiQuota: number;

  @ApiProperty({ description: '本月已调用次数' })
  @Expose()
  apiUsed: number;

  @ApiProperty({ description: 'API配额使用率' })
  @Expose()
  apiUsageRate: number;

  @ApiProperty({ description: '配额状态', enum: QuotaStatus })
  @Expose()
  status: QuotaStatus;
}

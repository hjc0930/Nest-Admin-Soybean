import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PageQueryDto } from 'src/shared/dto/base.dto';

/**
 * 租户配额查询DTO
 * Requirements: 5.1, 5.10
 */
export class ListTenantQuotaDto extends PageQueryDto {
  @ApiPropertyOptional({ description: '租户ID' })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({ description: '企业名称' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ description: '配额状态', enum: ['normal', 'warning', 'danger'] })
  @IsOptional()
  @IsString()
  status?: string;
}

/**
 * 更新租户配额DTO
 * Requirements: 5.3, 5.5
 */
export class UpdateTenantQuotaDto {
  @ApiProperty({ description: '租户ID' })
  @IsString()
  tenantId: string;

  @ApiPropertyOptional({ description: '用户数量配额，-1表示不限' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(-1)
  userQuota?: number;

  @ApiPropertyOptional({ description: '存储配额（MB），-1表示不限' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(-1)
  storageQuota?: number;

  @ApiPropertyOptional({ description: 'API调用配额（月），-1表示不限' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(-1)
  apiQuota?: number;
}

/**
 * 配额检查DTO
 * Requirements: 5.6, 5.8
 */
export class CheckQuotaDto {
  @ApiProperty({ description: '租户ID' })
  @IsString()
  tenantId: string;

  @ApiProperty({ description: '配额类型', enum: ['user', 'storage', 'api'] })
  @IsString()
  quotaType: 'user' | 'storage' | 'api';

  @ApiPropertyOptional({ description: '请求增量（默认1）' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  increment?: number;
}

/**
 * 增加配额使用量DTO
 */
export class IncrementQuotaUsageDto {
  @ApiProperty({ description: '租户ID' })
  @IsString()
  tenantId: string;

  @ApiProperty({ description: '配额类型', enum: ['user', 'storage', 'api'] })
  @IsString()
  quotaType: 'user' | 'storage' | 'api';

  @ApiProperty({ description: '增量' })
  @IsNumber()
  @Type(() => Number)
  increment: number;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { DateFormat } from '../decorators/date-format.decorator';

/**
 * 基础响应 DTO
 *
 * @description 所有响应 DTO 应继承此类，自动：
 * 1. 排除敏感字段（delFlag, tenantId, password 等）
 * 2. 格式化日期字段（createTime, updateTime）
 *
 * @example
 * ```typescript
 * export class UserResponseDto extends BaseResponseDto {
 *   @Expose()
 *   @ApiProperty({ description: '用户ID' })
 *   userId: number;
 *
 *   @Expose()
 *   @ApiProperty({ description: '用户名' })
 *   userName: string;
 * }
 * ```
 */
export abstract class BaseResponseDto {
  /**
   * 删除标记 - 不返回给前端
   */
  @Exclude()
  delFlag?: string;

  /**
   * 租户ID - 不返回给前端
   */
  @Exclude()
  tenantId?: number;

  /**
   * 密码 - 不返回给前端
   */
  @Exclude()
  password?: string;

  /**
   * 创建者
   */
  @ApiPropertyOptional({ description: '创建者' })
  @Expose()
  createBy?: string;

  /**
   * 创建时间 - 自动格式化为 'YYYY-MM-DD HH:mm:ss'
   */
  @ApiPropertyOptional({ description: '创建时间', example: '2025-01-01 00:00:00' })
  @Expose()
  @DateFormat()
  createTime?: string;

  /**
   * 更新者
   */
  @ApiPropertyOptional({ description: '更新者' })
  @Expose()
  updateBy?: string;

  /**
   * 更新时间 - 自动格式化为 'YYYY-MM-DD HH:mm:ss'
   */
  @ApiPropertyOptional({ description: '更新时间', example: '2025-01-01 00:00:00' })
  @Expose()
  @DateFormat()
  updateTime?: string;

  /**
   * 备注
   */
  @ApiPropertyOptional({ description: '备注' })
  @Expose()
  remark?: string;
}

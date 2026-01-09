import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

/**
 * 命令统计 DTO
 */
export class CommandStatDto {
  @Expose()
  @ApiProperty({ description: '命令名称' })
  name: string;

  @Expose()
  @ApiProperty({ description: '调用次数' })
  value: number;
}

/**
 * 缓存信息响应 DTO
 */
export class CacheInfoResponseDto {
  @Expose()
  @ApiProperty({ description: 'Redis信息' })
  info: Record<string, string>;

  @Expose()
  @ApiProperty({ description: '数据库大小' })
  dbSize: number;

  @Expose()
  @Type(() => CommandStatDto)
  @ApiProperty({ description: '命令统计', type: [CommandStatDto] })
  commandStats: CommandStatDto[];
}

/**
 * 缓存键值信息响应 DTO
 */
export class CacheKeyResponseDto {
  @Expose()
  @ApiProperty({ description: '缓存名称' })
  cacheName: string;

  @Expose()
  @ApiProperty({ description: '缓存键名' })
  cacheKey: string;

  @Expose()
  @ApiProperty({ description: '缓存内容' })
  cacheValue: string;

  @Expose()
  @ApiProperty({ description: '备注' })
  remark: string;
}

/**
 * 缓存名称列表响应 DTO
 */
export class CacheNamesResponseDto {
  @ApiProperty({ description: '缓存名称列表', type: [CacheKeyResponseDto] })
  names: CacheKeyResponseDto[];
}

/**
 * 缓存键名列表响应 DTO
 */
export class CacheKeysResponseDto {
  @ApiProperty({ description: '缓存键名列表', type: [String] })
  keys: string[];
}

/**
 * 清理缓存结果响应 DTO
 */
export class ClearCacheResultResponseDto {
  @Expose()
  @ApiProperty({ description: '清理是否成功', example: true })
  success: boolean;
}

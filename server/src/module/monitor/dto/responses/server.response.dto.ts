import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

/**
 * CPU 信息 DTO
 */
export class CpuInfoDto {
  @Expose()
  @ApiProperty({ description: 'CPU核心数' })
  cpuNum: number;

  @Expose()
  @ApiProperty({ description: '总计' })
  total: number;

  @Expose()
  @ApiProperty({ description: '系统使用率' })
  sys: string;

  @Expose()
  @ApiProperty({ description: '用户使用率' })
  used: string;

  @Expose()
  @ApiProperty({ description: '等待率' })
  wait: number;

  @Expose()
  @ApiProperty({ description: '空闲率' })
  free: string;
}

/**
 * 内存信息 DTO
 */
export class MemInfoDto {
  @Expose()
  @ApiProperty({ description: '总内存(GB)' })
  total: string;

  @Expose()
  @ApiProperty({ description: '已用内存(GB)' })
  used: string;

  @Expose()
  @ApiProperty({ description: '空闲内存(GB)' })
  free: string;

  @Expose()
  @ApiProperty({ description: '使用率(%)' })
  usage: string;
}

/**
 * 系统信息 DTO
 */
export class SysInfoDto {
  @Expose()
  @ApiProperty({ description: '计算机名称' })
  computerName: string;

  @Expose()
  @ApiProperty({ description: '计算机IP' })
  computerIp: string;

  @Expose()
  @ApiProperty({ description: '用户目录' })
  userDir: string;

  @Expose()
  @ApiProperty({ description: '操作系统名称' })
  osName: string;

  @Expose()
  @ApiProperty({ description: '操作系统架构' })
  osArch: string;
}

/**
 * 磁盘信息 DTO
 */
export class DiskInfoDto {
  @Expose()
  @ApiProperty({ description: '挂载点' })
  dirName: string;

  @Expose()
  @ApiProperty({ description: '文件系统类型' })
  typeName: string;

  @Expose()
  @ApiProperty({ description: '总大小' })
  total: string;

  @Expose()
  @ApiProperty({ description: '已用大小' })
  used: string;

  @Expose()
  @ApiProperty({ description: '空闲大小' })
  free: string;

  @Expose()
  @ApiProperty({ description: '使用率(%)' })
  usage: string;
}

/**
 * 服务器信息响应 DTO
 */
export class ServerInfoResponseDto {
  @Expose()
  @Type(() => CpuInfoDto)
  @ApiProperty({ description: 'CPU信息', type: CpuInfoDto })
  cpu: CpuInfoDto;

  @Expose()
  @Type(() => MemInfoDto)
  @ApiProperty({ description: '内存信息', type: MemInfoDto })
  mem: MemInfoDto;

  @Expose()
  @Type(() => SysInfoDto)
  @ApiProperty({ description: '系统信息', type: SysInfoDto })
  sys: SysInfoDto;

  @Expose()
  @Type(() => DiskInfoDto)
  @ApiProperty({ description: '磁盘信息', type: [DiskInfoDto] })
  sysFiles: DiskInfoDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/shared/dto/base.response.dto';

/**
 * 登录日志信息响应 DTO
 */
export class LoginLogResponseDto extends BaseResponseDto {
  @Expose()
  @ApiProperty({ description: '访问ID' })
  infoId: number;

  @Expose()
  @ApiProperty({ description: '用户账号' })
  userName: string;

  @Expose()
  @ApiProperty({ description: '登录IP地址' })
  ipaddr: string;

  @Expose()
  @ApiProperty({ description: '登录地点' })
  loginLocation: string;

  @Expose()
  @ApiProperty({ description: '浏览器类型' })
  browser: string;

  @Expose()
  @ApiProperty({ description: '操作系统' })
  os: string;

  @Expose()
  @ApiProperty({ description: '登录状态（0成功 1失败）' })
  status: string;

  @Expose()
  @ApiProperty({ description: '提示消息' })
  msg: string;

  @Expose()
  @ApiProperty({ description: '登录时间' })
  loginTime: Date;
}

/**
 * 登录日志列表响应 DTO
 */
export class LoginLogListResponseDto {
  @ApiProperty({ description: '登录日志列表', type: [LoginLogResponseDto] })
  rows: LoginLogResponseDto[];

  @ApiProperty({ description: '总数量' })
  total: number;
}

/**
 * 清除日志结果响应 DTO
 */
export class ClearLogResultResponseDto {
  @Expose()
  @ApiProperty({ description: '清除是否成功', example: true })
  success: boolean;
}

/**
 * 删除日志结果响应 DTO
 */
export class DeleteLogResultResponseDto {
  @Expose()
  @ApiProperty({ description: '删除的记录数', example: 1 })
  affected: number;
}

/**
 * 解锁用户结果响应 DTO
 */
export class UnlockUserResultResponseDto {
  @Expose()
  @ApiProperty({ description: '解锁是否成功', example: true })
  success: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/shared/dto/base.response.dto';

/**
 * 在线用户信息响应 DTO
 */
export class OnlineUserResponseDto extends BaseResponseDto {
  @Expose()
  @ApiProperty({ description: '会话编号' })
  tokenId: string;

  @Expose()
  @ApiProperty({ description: '用户名称' })
  userName: string;

  @Expose()
  @ApiProperty({ description: '部门名称' })
  deptName: string;

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
  @ApiProperty({ description: '登录时间' })
  loginTime: Date;

  @Expose()
  @ApiProperty({ description: '设备类型' })
  deviceType: string;
}

/**
 * 在线用户列表响应 DTO
 */
export class OnlineUserListResponseDto {
  @ApiProperty({ description: '在线用户列表', type: [OnlineUserResponseDto] })
  rows: OnlineUserResponseDto[];

  @ApiProperty({ description: '总数量' })
  total: number;
}

/**
 * 强退用户结果响应 DTO
 */
export class ForceLogoutResultResponseDto {
  @Expose()
  @ApiProperty({ description: '强退是否成功', example: true })
  success: boolean;
}

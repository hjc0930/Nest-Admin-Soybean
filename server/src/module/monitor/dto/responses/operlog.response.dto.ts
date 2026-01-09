import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/shared/dto/base.response.dto';

/**
 * 操作日志信息响应 DTO
 */
export class OperLogResponseDto extends BaseResponseDto {
  @Expose()
  @ApiProperty({ description: '日志主键' })
  operId: number;

  @Expose()
  @ApiProperty({ description: '模块标题' })
  title: string;

  @Expose()
  @ApiProperty({ description: '业务类型（0其它 1新增 2修改 3删除）' })
  businessType: number;

  @Expose()
  @ApiProperty({ description: '方法名称' })
  method: string;

  @Expose()
  @ApiProperty({ description: '请求方式' })
  requestMethod: string;

  @Expose()
  @ApiProperty({ description: '操作类别（0其它 1后台用户 2手机端用户）' })
  operatorType: number;

  @Expose()
  @ApiProperty({ description: '操作人员' })
  operName: string;

  @Expose()
  @ApiProperty({ description: '部门名称' })
  deptName: string;

  @Expose()
  @ApiProperty({ description: '请求URL' })
  operUrl: string;

  @Expose()
  @ApiProperty({ description: '主机地址' })
  operIp: string;

  @Expose()
  @ApiProperty({ description: '操作地点' })
  operLocation: string;

  @Expose()
  @ApiProperty({ description: '请求参数' })
  operParam: string;

  @Expose()
  @ApiProperty({ description: '返回参数' })
  jsonResult: string;

  @Expose()
  @ApiProperty({ description: '操作状态（0正常 1异常）' })
  status: number;

  @Expose()
  @ApiProperty({ description: '错误消息' })
  errorMsg: string;

  @Expose()
  @ApiProperty({ description: '操作时间' })
  operTime: Date;

  @Expose()
  @ApiProperty({ description: '消耗时间（毫秒）' })
  costTime: number;
}

/**
 * 操作日志列表响应 DTO
 */
export class OperLogListResponseDto {
  @ApiProperty({ description: '操作日志列表', type: [OperLogResponseDto] })
  rows: OperLogResponseDto[];

  @ApiProperty({ description: '总数量' })
  total: number;
}

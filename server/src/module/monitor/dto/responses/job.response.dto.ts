import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/shared/dto/base.response.dto';

/**
 * 定时任务信息响应 DTO
 */
export class JobResponseDto extends BaseResponseDto {
  @Expose()
  @ApiProperty({ description: '任务ID' })
  jobId: number;

  @Expose()
  @ApiProperty({ description: '任务名称' })
  jobName: string;

  @Expose()
  @ApiProperty({ description: '任务组名' })
  jobGroup: string;

  @Expose()
  @ApiProperty({ description: '调用目标字符串' })
  invokeTarget: string;

  @Expose()
  @ApiProperty({ description: 'cron执行表达式' })
  cronExpression: string;

  @Expose()
  @ApiProperty({ description: '计划执行错误策略' })
  misfirePolicy: string;

  @Expose()
  @ApiProperty({ description: '是否并发执行' })
  concurrent: string;

  @Expose()
  @ApiProperty({ description: '状态' })
  status: string;
}

/**
 * 定时任务列表响应 DTO
 */
export class JobListResponseDto {
  @ApiProperty({ description: '任务列表', type: [JobResponseDto] })
  rows: JobResponseDto[];

  @ApiProperty({ description: '总数量' })
  total: number;
}

/**
 * 定时任务日志响应 DTO
 */
export class JobLogResponseDto extends BaseResponseDto {
  @Expose()
  @ApiProperty({ description: '日志ID' })
  jobLogId: number;

  @Expose()
  @ApiProperty({ description: '任务名称' })
  jobName: string;

  @Expose()
  @ApiProperty({ description: '任务组名' })
  jobGroup: string;

  @Expose()
  @ApiProperty({ description: '调用目标字符串' })
  invokeTarget: string;

  @Expose()
  @ApiProperty({ description: '日志信息' })
  jobMessage: string;

  @Expose()
  @ApiProperty({ description: '执行状态' })
  status: string;

  @Expose()
  @ApiProperty({ description: '异常信息' })
  exceptionInfo: string;
}

/**
 * 定时任务日志列表响应 DTO
 */
export class JobLogListResponseDto {
  @ApiProperty({ description: '任务日志列表', type: [JobLogResponseDto] })
  rows: JobLogResponseDto[];

  @ApiProperty({ description: '总数量' })
  total: number;
}

/**
 * 创建定时任务结果响应 DTO
 */
export class CreateJobResultResponseDto {
  @Expose()
  @ApiProperty({ description: '创建的任务ID', example: 1 })
  jobId: number;
}

/**
 * 更新定时任务结果响应 DTO
 */
export class UpdateJobResultResponseDto {
  @Expose()
  @ApiProperty({ description: '更新是否成功', example: true })
  success: boolean;
}

/**
 * 删除定时任务结果响应 DTO
 */
export class DeleteJobResultResponseDto {
  @Expose()
  @ApiProperty({ description: '删除的记录数', example: 1 })
  affected: number;
}

/**
 * 修改任务状态结果响应 DTO
 */
export class ChangeJobStatusResultResponseDto {
  @Expose()
  @ApiProperty({ description: '修改是否成功', example: true })
  success: boolean;
}

/**
 * 执行任务结果响应 DTO
 */
export class RunJobResultResponseDto {
  @Expose()
  @ApiProperty({ description: '执行是否成功', example: true })
  success: boolean;
}

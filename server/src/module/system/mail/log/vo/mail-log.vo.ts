import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Result } from 'src/shared/response';

export class MailLogVo {
  @ApiProperty({ description: '日志ID' })
  id: string;

  @ApiPropertyOptional({ description: '用户ID' })
  userId?: number;

  @ApiPropertyOptional({ description: '用户类型' })
  userType?: number;

  @ApiProperty({ description: '收件人邮箱' })
  toMail: string;

  @ApiProperty({ description: '发送账号ID' })
  accountId: number;

  @ApiProperty({ description: '发件人邮箱' })
  fromMail: string;

  @ApiProperty({ description: '模板ID' })
  templateId: number;

  @ApiProperty({ description: '模板编码' })
  templateCode: string;

  @ApiProperty({ description: '发送人昵称' })
  templateNickname: string;

  @ApiProperty({ description: '邮件标题' })
  templateTitle: string;

  @ApiProperty({ description: '邮件内容' })
  templateContent: string;

  @ApiPropertyOptional({ description: '模板参数' })
  templateParams?: string;

  @ApiProperty({ description: '发送状态（0-发送中 1-成功 2-失败）' })
  sendStatus: number;

  @ApiProperty({ description: '发送时间' })
  sendTime: Date;

  @ApiPropertyOptional({ description: '错误信息' })
  errorMsg?: string;
}

export class MailLogDetailVo extends Result<MailLogVo> {}

export class MailLogListVo extends Result<{
  rows: MailLogVo[];
  total: number;
}> {}

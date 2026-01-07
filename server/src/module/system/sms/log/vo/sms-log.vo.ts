import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Result } from 'src/shared/response';

export class SmsLogVo {
  @ApiProperty({ description: '日志ID' })
  id: number;

  @ApiProperty({ description: '渠道ID' })
  channelId: number;

  @ApiProperty({ description: '渠道编码' })
  channelCode: string;

  @ApiProperty({ description: '模板ID' })
  templateId: number;

  @ApiProperty({ description: '模板编码' })
  templateCode: string;

  @ApiProperty({ description: '手机号码' })
  mobile: string;

  @ApiProperty({ description: '短信内容' })
  content: string;

  @ApiPropertyOptional({ description: '模板参数' })
  params?: string;

  @ApiProperty({ description: '发送状态' })
  sendStatus: number;

  @ApiPropertyOptional({ description: 'API发送编码' })
  apiSendCode?: string;

  @ApiPropertyOptional({ description: 'API接收编码' })
  apiReceiveCode?: string;

  @ApiPropertyOptional({ description: '错误信息' })
  errorMsg?: string;

  @ApiProperty({ description: '发送时间' })
  sendTime: Date;

  @ApiPropertyOptional({ description: '接收时间' })
  receiveTime?: Date;
}

export class SmsLogDetailVo extends Result<SmsLogVo> {}

export class SmsLogListVo extends Result<{
  rows: SmsLogVo[];
  total: number;
}> {}

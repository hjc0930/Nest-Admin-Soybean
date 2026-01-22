import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/shared/dto/base.response.dto';
import { DateFormat } from 'src/shared/decorators';

/**
 * 短信日志响应 DTO
 */
export class SmsLogResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '日志ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: '渠道ID' })
  @Expose()
  channelId: number;

  @ApiProperty({ description: '渠道编码' })
  @Expose()
  channelCode: string;

  @ApiProperty({ description: '模板ID' })
  @Expose()
  templateId: number;

  @ApiProperty({ description: '模板编码' })
  @Expose()
  templateCode: string;

  @ApiProperty({ description: '手机号码' })
  @Expose()
  mobile: string;

  @ApiProperty({ description: '短信内容' })
  @Expose()
  content: string;

  @ApiPropertyOptional({ description: '模板参数' })
  @Expose()
  params?: string;

  @ApiProperty({ description: '发送状态' })
  @Expose()
  sendStatus: number;

  @ApiPropertyOptional({ description: 'API发送编码' })
  @Expose()
  apiSendCode?: string;

  @ApiPropertyOptional({ description: 'API接收编码' })
  @Expose()
  apiReceiveCode?: string;

  @ApiPropertyOptional({ description: '错误信息' })
  @Expose()
  errorMsg?: string;

  @ApiProperty({ description: '发送时间' })
  @Expose()
  @DateFormat()
  sendTime: string;

  @ApiPropertyOptional({ description: '接收时间' })
  @Expose()
  @DateFormat()
  receiveTime?: string;
}

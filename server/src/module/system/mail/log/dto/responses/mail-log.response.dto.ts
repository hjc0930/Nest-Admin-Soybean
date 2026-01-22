import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/shared/dto/base.response.dto';
import { DateFormat } from 'src/shared/decorators';

/**
 * 邮件日志响应 DTO
 */
export class MailLogResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '日志ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: '用户ID' })
  @Expose()
  userId: number;

  @ApiProperty({ description: '用户类型' })
  @Expose()
  userType: number;

  @ApiProperty({ description: '收件邮箱' })
  @Expose()
  toMail: string;

  @ApiProperty({ description: '账号ID' })
  @Expose()
  accountId: number;

  @ApiProperty({ description: '发件邮箱' })
  @Expose()
  fromMail: string;

  @ApiProperty({ description: '模板ID' })
  @Expose()
  templateId: number;

  @ApiProperty({ description: '模板编码' })
  @Expose()
  templateCode: string;

  @ApiPropertyOptional({ description: '模板参数' })
  @Expose()
  templateParams?: string;

  @ApiProperty({ description: '邮件标题' })
  @Expose()
  templateTitle: string;

  @ApiProperty({ description: '邮件内容' })
  @Expose()
  templateContent: string;

  @ApiProperty({ description: '发送状态' })
  @Expose()
  sendStatus: number;

  @ApiPropertyOptional({ description: '发送时间' })
  @Expose()
  @DateFormat()
  sendTime?: string;

  @ApiPropertyOptional({ description: '发送消息ID' })
  @Expose()
  sendMessageId?: string;

  @ApiPropertyOptional({ description: '发送异常' })
  @Expose()
  sendException?: string;
}

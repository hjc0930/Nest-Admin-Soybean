import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Result } from 'src/shared/response';

export class NotifyMessageVo {
  @ApiProperty({ description: '消息ID' })
  id: bigint;

  @ApiProperty({ description: '租户ID' })
  tenantId: string;

  @ApiProperty({ description: '用户ID' })
  userId: number;

  @ApiProperty({ description: '用户类型' })
  userType: number;

  @ApiProperty({ description: '模板ID' })
  templateId: number;

  @ApiProperty({ description: '模板编码' })
  templateCode: string;

  @ApiProperty({ description: '发送人名称' })
  templateNickname: string;

  @ApiProperty({ description: '消息内容' })
  templateContent: string;

  @ApiPropertyOptional({ description: '模板参数' })
  templateParams?: string;

  @ApiProperty({ description: '已读状态' })
  readStatus: boolean;

  @ApiPropertyOptional({ description: '已读时间' })
  readTime?: Date;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;
}

export class NotifyMessageDetailVo extends Result<NotifyMessageVo> {}

export class NotifyMessageListVo extends Result<{
  rows: NotifyMessageVo[];
  total: number;
}> {}

export class UnreadCountVo extends Result<{
  count: number;
}> {}

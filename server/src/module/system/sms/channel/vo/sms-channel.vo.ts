import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Result } from 'src/shared/response';

export class SmsChannelVo {
  @ApiProperty({ description: '渠道ID' })
  id: number;

  @ApiProperty({ description: '渠道编码' })
  code: string;

  @ApiProperty({ description: '渠道名称' })
  name: string;

  @ApiProperty({ description: '短信签名' })
  signature: string;

  @ApiProperty({ description: 'API Key' })
  apiKey: string;

  @ApiPropertyOptional({ description: '回调地址' })
  callbackUrl?: string;

  @ApiProperty({ description: '状态' })
  status: string;

  @ApiPropertyOptional({ description: '备注' })
  remark?: string;

  @ApiProperty({ description: '创建者' })
  createBy: string;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiPropertyOptional({ description: '更新者' })
  updateBy?: string;

  @ApiPropertyOptional({ description: '更新时间' })
  updateTime?: Date;
}

export class SmsChannelDetailVo extends Result<SmsChannelVo> {}

export class SmsChannelListVo extends Result<{
  rows: SmsChannelVo[];
  total: number;
}> {}

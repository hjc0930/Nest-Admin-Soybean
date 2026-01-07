import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Result } from 'src/shared/response';

export class SmsTemplateVo {
  @ApiProperty({ description: '模板ID' })
  id: number;

  @ApiProperty({ description: '渠道ID' })
  channelId: number;

  @ApiPropertyOptional({ description: '渠道编码' })
  channelCode?: string;

  @ApiPropertyOptional({ description: '渠道名称' })
  channelName?: string;

  @ApiProperty({ description: '模板编码' })
  code: string;

  @ApiProperty({ description: '模板名称' })
  name: string;

  @ApiProperty({ description: '模板内容' })
  content: string;

  @ApiPropertyOptional({ description: '参数列表' })
  params?: string;

  @ApiProperty({ description: '第三方模板ID' })
  apiTemplateId: string;

  @ApiProperty({ description: '模板类型' })
  type: number;

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

export class SmsTemplateDetailVo extends Result<SmsTemplateVo> {}

export class SmsTemplateListVo extends Result<{
  rows: SmsTemplateVo[];
  total: number;
}> {}

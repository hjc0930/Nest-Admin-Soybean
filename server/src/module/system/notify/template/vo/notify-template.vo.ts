import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Result } from 'src/shared/response';

export class NotifyTemplateVo {
  @ApiProperty({ description: '模板ID' })
  id: number;

  @ApiProperty({ description: '模板名称' })
  name: string;

  @ApiProperty({ description: '模板编码' })
  code: string;

  @ApiProperty({ description: '发送人名称' })
  nickname: string;

  @ApiProperty({ description: '模板内容' })
  content: string;

  @ApiPropertyOptional({ description: '参数列表' })
  params?: string;

  @ApiProperty({ description: '类型（1-系统通知 2-业务通知）' })
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

export class NotifyTemplateDetailVo extends Result<NotifyTemplateVo> {}

export class NotifyTemplateListVo extends Result<{
  rows: NotifyTemplateVo[];
  total: number;
}> {}

export class NotifyTemplateSelectVo extends Result<
  Array<{
    id: number;
    name: string;
    code: string;
  }>
> {}

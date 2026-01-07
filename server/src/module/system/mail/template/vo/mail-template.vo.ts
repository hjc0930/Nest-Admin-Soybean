import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Result } from 'src/shared/response';

export class MailTemplateVo {
  @ApiProperty({ description: '模板ID' })
  id: number;

  @ApiProperty({ description: '模板名称' })
  name: string;

  @ApiProperty({ description: '模板编码' })
  code: string;

  @ApiProperty({ description: '发送账号ID' })
  accountId: number;

  @ApiPropertyOptional({ description: '发送账号邮箱' })
  accountMail?: string;

  @ApiProperty({ description: '发送人昵称' })
  nickname: string;

  @ApiProperty({ description: '邮件标题' })
  title: string;

  @ApiProperty({ description: '邮件内容（HTML）' })
  content: string;

  @ApiPropertyOptional({ description: '参数列表' })
  params?: string;

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

export class MailTemplateDetailVo extends Result<MailTemplateVo> {}

export class MailTemplateListVo extends Result<{
  rows: MailTemplateVo[];
  total: number;
}> {}

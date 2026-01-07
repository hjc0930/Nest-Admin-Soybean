import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Result } from 'src/shared/response';

export class MailAccountVo {
  @ApiProperty({ description: '账号ID' })
  id: number;

  @ApiProperty({ description: '邮箱地址' })
  mail: string;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: 'SMTP主机' })
  host: string;

  @ApiProperty({ description: 'SMTP端口' })
  port: number;

  @ApiProperty({ description: '是否启用SSL' })
  sslEnable: boolean;

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

export class MailAccountDetailVo extends Result<MailAccountVo> {}

export class MailAccountListVo extends Result<{
  rows: MailAccountVo[];
  total: number;
}> {}

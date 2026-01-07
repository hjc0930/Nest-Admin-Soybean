import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateNotifyTemplateDto } from './create-notify-template.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateNotifyTemplateDto extends PartialType(CreateNotifyTemplateDto) {
  @ApiProperty({ description: '模板ID', example: 1 })
  @IsNumber()
  id: number;
}

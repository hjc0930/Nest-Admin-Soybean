import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSmsTemplateDto } from './create-sms-template.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSmsTemplateDto extends PartialType(CreateSmsTemplateDto) {
  @ApiProperty({ description: '模板ID', example: 1 })
  @IsNumber()
  id: number;
}

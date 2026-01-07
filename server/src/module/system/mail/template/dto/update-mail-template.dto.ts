import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMailTemplateDto } from './create-mail-template.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMailTemplateDto extends PartialType(CreateMailTemplateDto) {
  @ApiProperty({ description: '模板ID', example: 1 })
  @IsNumber()
  id: number;
}

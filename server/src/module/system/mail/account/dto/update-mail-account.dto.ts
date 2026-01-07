import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMailAccountDto } from './create-mail-account.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMailAccountDto extends PartialType(CreateMailAccountDto) {
  @ApiProperty({ description: '账号ID', example: 1 })
  @IsNumber()
  id: number;
}

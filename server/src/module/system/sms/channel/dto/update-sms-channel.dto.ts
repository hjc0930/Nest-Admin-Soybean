import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSmsChannelDto } from './create-sms-channel.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSmsChannelDto extends PartialType(CreateSmsChannelDto) {
  @ApiProperty({ description: '渠道ID', example: 1 })
  @IsNumber()
  id: number;
}

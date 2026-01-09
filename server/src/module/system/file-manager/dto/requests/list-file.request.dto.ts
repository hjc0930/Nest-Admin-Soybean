import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListFileRequestDto {
  @ApiProperty({ required: false, description: '文件夹ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  folderId?: number;

  @ApiProperty({ required: false, description: '文件名' })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ required: false, description: '文件类型（扩展名）' })
  @IsOptional()
  @IsString()
  ext?: string;

  @ApiProperty({ required: false, description: '文件类型列表（扩展名，逗号分隔，用于批量筛选）' })
  @IsOptional()
  @IsString()
  exts?: string;

  @ApiProperty({ required: false, description: '存储类型' })
  @IsOptional()
  @IsString()
  storageType?: string;

  @ApiProperty({ required: false, description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  pageNum?: number;

  @ApiProperty({ required: false, description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number;
}

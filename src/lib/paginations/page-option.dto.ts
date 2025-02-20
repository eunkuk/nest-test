import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString, Max, ValidateNested } from 'class-validator';
import { Type as TypeDecorator } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum PaginationDefault {
  PAGE_DEFAULT = 1,
  TAKE_DEFAULT = 10,
  SKIP_DEFAULT = 0,
}

class SortOption {
  @ApiProperty({ name: 'sort[0][field]', required: false, type: String, description: '정렬할 필드', example: 'id' })
  @IsString()
  field: string;

  @ApiProperty({ name: 'sort[0][by]', required: false, enum: ['asc', 'desc'], description: '정렬 방식', example: 'asc' })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  by: 'asc' | 'desc';
}

export class PageOptionDto {
  @ApiProperty({ example: 1, description: '페이지 번호', type: Number })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly page?: number = PaginationDefault.PAGE_DEFAULT;

  @ApiProperty({ example: 10, description: '페이지 당 항목 수', maximum: 100, type: Number })
  @Type(() => Number)
  @Max(100)
  @IsInt()
  @IsOptional()
  readonly take?: number = PaginationDefault.TAKE_DEFAULT;

  @ApiProperty({ type: [SortOption], description: '정렬 옵션' })
  @IsArray()
  @ValidateNested({ each: true })
  @TypeDecorator(() => SortOption)
  @IsOptional()
  readonly sort?: SortOption[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateExamDto {
  @ApiProperty({ description: '이름' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '삭제여부' })
  @IsString()
  @IsOptional()
  is_delete?: string;
}

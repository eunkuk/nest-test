import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class EmailDto {
  @ApiProperty({ description: '이메일' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;
}

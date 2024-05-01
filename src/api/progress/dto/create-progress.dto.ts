import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgressDto {
  @ApiProperty({ example: '60e9c3e2f1f5a5f3c4f4d4d9' })
  @IsNotEmpty()
  @IsString()
  course: string;

  @ApiProperty({ example: '60e9c3e2f1f5a5f3c4f4d4d9' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: '60e9c3e2f1f5a5f3c4f4d4d9' })
  @IsNotEmpty()
  @IsString()
  lecture: string;
}

import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({ example: 'This is a title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is a description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  order: number;

  @ApiProperty({ example: '6578498fddfbb9e43' })
  @IsNotEmpty()
  @IsString()
  course: string;

  @IsOptional()
  @IsString()
  instructor: string;
}

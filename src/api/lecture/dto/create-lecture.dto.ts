import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLectureDto {
  @ApiProperty({ example: 'This is a title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is a description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '6578498fddfbb9e43' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  order: number;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=8zKuNo4ay8E' })
  @IsNotEmpty()
  @IsString()
  videoUrl: string;

  @ApiProperty({ example: '13 minutes' })
  @IsNotEmpty()
  @IsString()
  duration: string;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  isPreview: boolean;

  @ApiProperty({ example: ['tag1', 'tag2'] })
  @IsOptional()
  @IsArray()
  resources: string[];
}

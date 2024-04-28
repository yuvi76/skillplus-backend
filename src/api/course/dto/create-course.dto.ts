import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Learn NestJS' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn NestJS from scratch' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 500 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedPrice: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  duration: number; // Duration in hours

  @ApiProperty({ example: 'https://www.example.com/thumbnail.png' })
  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsString()
  instructor: string;

  @ApiProperty({ example: ['development', 'javascript'] })
  @IsNotEmpty()
  @IsArray()
  category: string[];

  @ApiProperty({ example: ['662cc5142dc0400287955c6b'] })
  @IsOptional()
  @IsArray()
  lessons: string[];

  @ApiProperty({ example: ['tag1', 'tag2'] })
  @IsOptional()
  @IsArray()
  tags: string[];

  @ApiProperty({ example: 'English' })
  @IsOptional()
  @IsString()
  language: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublished: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isFree: boolean;
}

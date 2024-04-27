import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedPrice: number;

  @IsNotEmpty()
  @IsNumber()
  duration: number; // Duration in hours

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  instructor: string;

  @IsNotEmpty()
  @IsArray()
  category: string[];

  @IsOptional()
  @IsArray()
  lessons: string[];

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsOptional()
  @IsString()
  language: string;

  @IsOptional()
  @IsBoolean()
  isPublished: boolean;

  @IsOptional()
  @IsBoolean()
  isFree: boolean;
}

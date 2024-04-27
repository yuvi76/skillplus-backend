import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCourseListDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number;

  @ApiProperty({ example: 'javascript' })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ example: 'development' })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({ example: 'Yuvi' })
  @IsOptional()
  @IsString()
  instructor: string;

  @ApiProperty({ example: 'English' })
  @IsOptional()
  @IsString()
  language: string;

  @ApiProperty({ example: ['javascript', 'development'] })
  @IsOptional()
  @IsArray()
  tags: string[];

  @ApiProperty({ example: 'price' })
  @IsOptional()
  @IsString()
  sort: string;

  @ApiProperty({ example: 'asc' })
  @IsOptional()
  @IsString()
  order: string;
}

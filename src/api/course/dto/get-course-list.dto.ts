import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetCourseListDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  instructor: string;

  @IsOptional()
  @IsString()
  language: string;

  @IsOptional()
  @IsString()
  tags: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  order: string;

  @IsOptional()
  @IsString()
  price: string;
}

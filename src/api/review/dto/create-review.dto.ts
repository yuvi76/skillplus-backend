import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  user: string;

  @ApiProperty({ example: '662cc5142dc0400287955caaa' })
  @IsNotEmpty()
  @IsString()
  course: string;

  @ApiProperty({ example: 4.5 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'This course is awesome!' })
  @IsNotEmpty()
  @IsString()
  review: string;
}

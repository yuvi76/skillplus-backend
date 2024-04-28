import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiProperty({ example: 'This course is awesome!' })
  @IsOptional()
  @IsString()
  reply: string;

  @ApiProperty({ example: '662cc5142dc0400287955caaa' })
  @IsOptional()
  @IsString()
  repliedBy: string;
}

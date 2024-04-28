import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetReviewListDto {
  @ApiProperty({ example: 'ss7sfbs5e7e2f5d3d3c' })
  @IsNotEmpty()
  @IsString()
  course: string;
}

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '6578498fddfbb9e43' })
  @IsNotEmpty()
  @IsString()
  course: string;

  user: string;
}

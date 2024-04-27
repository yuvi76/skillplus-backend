import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordRequestDto {
  @ApiProperty({ example: 'yuvi@yopmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

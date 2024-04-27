import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsOptional()
  @IsString()
  readonly username?: string;

  @ApiProperty({ example: 'yuvi@yopmail.com' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;
}

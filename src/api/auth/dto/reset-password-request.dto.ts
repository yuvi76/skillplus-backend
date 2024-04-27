import { IsString, IsStrongPassword, IsNotEmpty } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  newPassword: string;
}

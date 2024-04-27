import { IsEmail, IsNotEmpty } from 'class-validator';
export class ForgotPasswordRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

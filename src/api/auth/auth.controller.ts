import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './dto/signup-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import ResponseDto from '../../util/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body() signupRequestDto: SignupRequestDto,
  ): Promise<ResponseDto> {
    return await this.authService.signup(signupRequestDto);
  }

  @Post('/login')
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<ResponseDto> {
    return await this.authService.login(loginRequestDto);
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body() forgotPasswordRequestDto: ForgotPasswordRequestDto,
  ): Promise<ResponseDto> {
    return await this.authService.forgotPassword(forgotPasswordRequestDto);
  }

  @Post('/resetpassword')
  async resetPassword(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<ResponseDto> {
    return await this.authService.resetPassword(resetPasswordRequestDto);
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() Body: { refreshToken: string },
  ): Promise<ResponseDto> {
    return await this.authService.refreshToken(Body.refreshToken);
  }

  @Get('/verify-email/:token')
  async verifyEmail(@Param('token') token: string): Promise<ResponseDto> {
    return await this.authService.verifyEmail(token);
  }
}

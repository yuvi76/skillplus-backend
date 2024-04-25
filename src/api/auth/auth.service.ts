import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { SignupRequestDto } from './dto/signup-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { User } from '../../api/users/models/user.model';
import ResponseDto from '../../util/response.dto';
import { ErrorHandlerService } from '../../util/error-handler.service';
import { MESSAGE } from '../../constant/message';
import { EmailService } from '../../helper/email-helper.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly emailService: EmailService,
  ) {}

  async signup(signupRequestDto: SignupRequestDto): Promise<ResponseDto> {
    try {
      const { email } = signupRequestDto;
      const user = await this.userModel.findOne({ email });
      if (user) {
        throw new HttpException(
          MESSAGE.USER_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }

      const token = this.jwtService.sign({ email }, { expiresIn: '1h' });

      const emailHtml = `Click <a href="http://localhost:3000/api/auth/verify-email/${token}">here</a> to verify your email`;
      await this.emailService.sendEmail(email, 'Verify Email', emailHtml);

      const newUser = new this.userModel(signupRequestDto);
      await newUser.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.USER_SIGNUP_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async login(loginRequestDto: LoginRequestDto): Promise<ResponseDto> {
    try {
      const { email, password } = loginRequestDto;

      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new HttpException(
          MESSAGE.INVALID_CREDENTIALS,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new HttpException(
          MESSAGE.INVALID_CREDENTIALS,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payload = {
        email,
        userId: user._id,
        role: user.role,
        username: user.username,
      };
      const token = this.jwtService.sign(payload);

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.USER_LOGIN_SUCCESS,
        data: { token },
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async forgotPassword(
    forgotPasswordRequestDto: ForgotPasswordRequestDto,
  ): Promise<ResponseDto> {
    try {
      const { email } = forgotPasswordRequestDto;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new HttpException(MESSAGE.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const token = this.jwtService.sign({ email }, { expiresIn: '1h' });
      await this.userModel.findOneAndUpdate(
        { email },
        { resetPasswordToken: token },
      );

      const emailHtml = `Click <a href="http://localhost:3000/api/auth/resetpassword/${token}">here</a> to reset your password`;
      await this.emailService.sendEmail(email, 'Reset Password', emailHtml);

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.RESET_PASSWORD_TOKEN_SENT,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async resetPassword(
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<ResponseDto> {
    try {
      const { newPassword, token } = resetPasswordRequestDto;
      const decoded = this.jwtService.verify(token);

      const user = await this.userModel.findOne({ email: decoded.email });
      if (
        !user ||
        user.resetPasswordToken !== token ||
        !user.resetPasswordToken
      ) {
        throw new HttpException(MESSAGE.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
      }

      user.password = newPassword;
      user.resetPasswordToken = null;
      await user.save();

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.PASSWORD_RESET_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async refreshToken(token: string): Promise<ResponseDto> {
    try {
      const decoded = this.jwtService.verify(token);
      console.log(decoded);
      const payload = { email: decoded.email, sub: decoded.sub };
      const newToken = this.jwtService.sign(payload);

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.REFRESH_TOKEN_SUCCESS,
        data: { newToken },
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async verifyEmail(token: string): Promise<ResponseDto> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findOne({ email: decoded.email });
      if (!user) {
        throw new HttpException(MESSAGE.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      if (user.isVerified) {
        throw new HttpException(
          MESSAGE.USER_ALREADY_VERIFIED,
          HttpStatus.CONFLICT,
        );
      }

      user.isVerified = true;
      await user.save();

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.USER_VERIFIED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}

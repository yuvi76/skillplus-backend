import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { SignupRequestDto } from './dto/signup-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { User } from 'src/api/users/models/user.model';
import ResponseDto from 'src/util/response.dto';
import { ErrorHandlerService } from 'src/util/error-handler.service';
import { MESSAGE } from 'src/constant/message';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly errorHandlerService: ErrorHandlerService,
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

      const newUser = new this.userModel(signupRequestDto);
      await newUser.save();

      const token = this.jwtService.sign({ email }, { expiresIn: '1h' });
      // Implement logic to send email with verification token

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

      const payload = { email, sub: user._id };
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
      // Implement logic to send email with reset password token

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
      const user = await this.userModel.findOneAndUpdate(
        { email: decoded.email },
        { isVerified: true },
        { new: true },
      );
      if (!user) {
        throw new HttpException(MESSAGE.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.USER_VERIFIED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}

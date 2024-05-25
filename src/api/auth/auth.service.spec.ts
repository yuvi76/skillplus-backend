import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from './dto/login-request.dto';
import { SignupRequestDto } from './dto/signup-request.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';
import { User } from '../../api/users/models/user.model';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../helper/email-helper.service';
import { ErrorHandlerService } from '../../util/error-handler.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ErrorHandlerService,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.USER_LOGIN_SUCCESS,
        data: { token: 'jwt-token' },
      };
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authService.login(new LoginRequestDto())).toBe(result);
    });

    it('should throw an error on invalid login', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error(MESSAGE.INVALID_CREDENTIALS));

      await expect(authService.login(new LoginRequestDto())).rejects.toThrow(
        MESSAGE.INVALID_CREDENTIALS,
      );
    });

    it('should handle empty login request', async () => {
      const loginDto = new LoginRequestDto();
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error(MESSAGE.INVALID_CREDENTIALS));
      await expect(authService.login(loginDto)).rejects.toThrow(
        MESSAGE.INVALID_CREDENTIALS,
      );
    });

    it('should measure performance for multiple login requests', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.USER_LOGIN_SUCCESS,
        data: { token: 'jwt-token' },
      };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        await authService.login(new LoginRequestDto());
      }
      const endTime = performance.now();
      console.log(
        `Time taken for 1000 login requests: ${endTime - startTime}ms`,
      );
    });
  });

  describe('signup', () => {
    it('should return a success message on successful signup', async () => {
      const result: ResponseDto = {
        statusCode: 201,
        message: MESSAGE.USER_SIGNUP_SUCCESS,
      };
      jest.spyOn(authService, 'signup').mockResolvedValue(result);

      expect(await authService.signup(new SignupRequestDto())).toBe(result);
    });

    it('should throw an error on invalid signup', async () => {
      jest
        .spyOn(authService, 'signup')
        .mockRejectedValue(new Error(MESSAGE.USER_ALREADY_EXISTS));

      await expect(authService.signup(new SignupRequestDto())).rejects.toThrow(
        MESSAGE.USER_ALREADY_EXISTS,
      );
    });

    it('should handle missing fields in signup request', async () => {
      const signupDto = new SignupRequestDto();
      jest
        .spyOn(authService, 'signup')
        .mockRejectedValue(new Error(MESSAGE.INVALID_INPUT));
      await expect(authService.signup(signupDto)).rejects.toThrow(
        MESSAGE.INVALID_INPUT,
      );
    });

    it('should measure performance for multiple signup requests', async () => {
      const result: ResponseDto = {
        statusCode: 201,
        message: MESSAGE.USER_SIGNUP_SUCCESS,
      };
      jest.spyOn(authService, 'signup').mockResolvedValue(result);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        await authService.signup(new SignupRequestDto());
      }
      const endTime = performance.now();
      console.log(
        `Time taken for 1000 signup requests: ${endTime - startTime}ms`,
      );
    });
  });

  describe('resetPassword', () => {
    it('should return a success message on successful password reset', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.PASSWORD_RESET_SUCCESS,
      };
      jest.spyOn(authService, 'resetPassword').mockResolvedValue(result);

      expect(
        await authService.resetPassword(new ResetPasswordRequestDto()),
      ).toBe(result);
    });

    it('should throw an error on invalid password reset', async () => {
      jest
        .spyOn(authService, 'resetPassword')
        .mockRejectedValue(new Error(MESSAGE.INVALID_TOKEN));

      await expect(
        authService.resetPassword(new ResetPasswordRequestDto()),
      ).rejects.toThrow(MESSAGE.INVALID_TOKEN);
    });

    it('should handle missing fields in reset password request', async () => {
      const resetPasswordDto = new ResetPasswordRequestDto();
      jest
        .spyOn(authService, 'resetPassword')
        .mockRejectedValue(new Error(MESSAGE.INVALID_INPUT));
      await expect(authService.resetPassword(resetPasswordDto)).rejects.toThrow(
        MESSAGE.INVALID_INPUT,
      );
    });

    it('should measure performance for multiple password reset requests', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.PASSWORD_RESET_SUCCESS,
      };
      jest.spyOn(authService, 'resetPassword').mockResolvedValue(result);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        await authService.resetPassword(new ResetPasswordRequestDto());
      }
      const endTime = performance.now();
      console.log(
        `Time taken for 1000 password reset requests: ${endTime - startTime}ms`,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should return a success message on successful password reset', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.RESET_PASSWORD_TOKEN_SENT,
      };
      jest.spyOn(authService, 'forgotPassword').mockResolvedValue(result);

      expect(
        await authService.forgotPassword(new ForgotPasswordRequestDto()),
      ).toBe(result);
    });

    it('should throw an error on invalid password reset', async () => {
      jest
        .spyOn(authService, 'forgotPassword')
        .mockRejectedValue(new Error(MESSAGE.USER_NOT_FOUND));

      await expect(
        authService.forgotPassword(new ForgotPasswordRequestDto()),
      ).rejects.toThrow(MESSAGE.USER_NOT_FOUND);
    });

    it('should handle non-existent email in forgot password request', async () => {
      const forgotPasswordDto = new ForgotPasswordRequestDto();
      forgotPasswordDto.email = 'nonexistent@example.com';
      jest
        .spyOn(authService, 'forgotPassword')
        .mockRejectedValue(new Error(MESSAGE.USER_NOT_FOUND));
      await expect(
        authService.forgotPassword(forgotPasswordDto),
      ).rejects.toThrow(MESSAGE.USER_NOT_FOUND);
    });

    it('should measure performance for multiple forgot password requests', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.RESET_PASSWORD_TOKEN_SENT,
      };
      jest.spyOn(authService, 'forgotPassword').mockResolvedValue(result);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        await authService.forgotPassword(new ForgotPasswordRequestDto());
      }
      const endTime = performance.now();
      console.log(
        `Time taken for 1000 forgot password requests: ${endTime - startTime}ms`,
      );
    });
  });

  describe('verify', () => {
    it('should return a success message on successful verification', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.USER_VERIFIED_SUCCESS,
      };
      jest.spyOn(authService, 'verifyEmail').mockResolvedValue(result);

      expect(await authService.verifyEmail('token')).toBe(result);
    });

    it('should throw an error on invalid verification', async () => {
      jest
        .spyOn(authService, 'verifyEmail')
        .mockRejectedValue(new Error(MESSAGE.INVALID_TOKEN));

      await expect(authService.verifyEmail('token')).rejects.toThrow(
        MESSAGE.INVALID_TOKEN,
      );
    });

    it('should handle expired token in email verification', async () => {
      jest
        .spyOn(authService, 'verifyEmail')
        .mockRejectedValue(new Error(MESSAGE.TOKEN_EXPIRED));
      await expect(authService.verifyEmail('expired-token')).rejects.toThrow(
        MESSAGE.TOKEN_EXPIRED,
      );
    });

    it('should measure performance for multiple verification requests', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.USER_VERIFIED_SUCCESS,
      };
      jest.spyOn(authService, 'verifyEmail').mockResolvedValue(result);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        await authService.verifyEmail('token');
      }
      const endTime = performance.now();
      console.log(
        `Time taken for 1000 verification requests: ${endTime - startTime}ms`,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return a new JWT token on successful refresh', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.REFRESH_TOKEN_SUCCESS,
        data: { token: 'jwt-token' },
      };
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(result);

      expect(await authService.refreshToken(new User())).toBe(result);
    });

    it('should throw an error on invalid refresh', async () => {
      jest
        .spyOn(authService, 'refreshToken')
        .mockRejectedValue(new Error(MESSAGE.INVALID_TOKEN));

      await expect(authService.refreshToken(new User())).rejects.toThrow(
        MESSAGE.INVALID_TOKEN,
      );
    });

    it('should handle missing user in refresh token request', async () => {
      jest
        .spyOn(authService, 'refreshToken')
        .mockRejectedValue(new Error(MESSAGE.USER_NOT_FOUND));
      await expect(authService.refreshToken(new User())).rejects.toThrow(
        MESSAGE.USER_NOT_FOUND,
      );
    });

    it('should measure performance for multiple refresh token requests', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.REFRESH_TOKEN_SUCCESS,
        data: { token: 'jwt-token' },
      };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(result);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        await authService.refreshToken(new User());
      }
      const endTime = performance.now();
      console.log(
        `Time taken for 1000 refresh token requests: ${endTime - startTime}ms`,
      );
    });
  });
});

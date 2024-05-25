import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { SignupRequestDto } from './dto/signup-request.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ForgotPasswordRequestDto } from './dto/forgot-password-request.dto';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            signup: jest.fn(),
            resetPassword: jest.fn(),
            forgotPassword: jest.fn(),
            refreshToken: jest.fn(),
            verifyEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.USER_LOGIN_SUCCESS,
        data: { token: 'jwt-token' },
      };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(new LoginRequestDto())).toBe(result);
    });

    it('should throw an error on invalid login', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error(MESSAGE.INVALID_CREDENTIALS));
      await expect(authController.login(new LoginRequestDto())).rejects.toThrow(
        MESSAGE.INVALID_CREDENTIALS,
      );
    });

    it('should handle empty login request', async () => {
      const loginDto = new LoginRequestDto();
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error(MESSAGE.INVALID_CREDENTIALS));
      await expect(authController.login(loginDto)).rejects.toThrow(
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
        await authController.login(new LoginRequestDto());
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
        data: { userId: 'user-id' },
      };
      jest.spyOn(authService, 'signup').mockResolvedValue(result);

      expect(await authController.signup(new SignupRequestDto())).toBe(result);
    });

    it('should throw an error on invalid signup', async () => {
      jest
        .spyOn(authService, 'signup')
        .mockRejectedValue(new Error(MESSAGE.INVALID_INPUT));
      await expect(
        authController.signup(new SignupRequestDto()),
      ).rejects.toThrow(MESSAGE.INVALID_INPUT);
    });

    it('should handle missing fields in signup request', async () => {
      const signupDto = new SignupRequestDto();
      jest
        .spyOn(authService, 'signup')
        .mockRejectedValue(new Error(MESSAGE.INVALID_INPUT));
      await expect(authController.signup(signupDto)).rejects.toThrow(
        MESSAGE.INVALID_INPUT,
      );
    });

    it('should measure performance for multiple signup requests', async () => {
      const result: ResponseDto = {
        statusCode: 201,
        message: MESSAGE.USER_SIGNUP_SUCCESS,
        data: { userId: 'user-id' },
      };
      jest.spyOn(authService, 'signup').mockResolvedValue(result);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        await authController.signup(new SignupRequestDto());
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
        await authController.resetPassword(new ResetPasswordRequestDto()),
      ).toBe(result);
    });

    it('should throw an error on invalid password reset', async () => {
      jest
        .spyOn(authService, 'resetPassword')
        .mockRejectedValue(new Error(MESSAGE.INVALID_TOKEN));
      await expect(
        authController.resetPassword(new ResetPasswordRequestDto()),
      ).rejects.toThrow(MESSAGE.INVALID_TOKEN);
    });

    it('should measure performance for multiple password reset requests', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.PASSWORD_RESET_SUCCESS,
      };
      jest.spyOn(authService, 'resetPassword').mockResolvedValue(result);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        await authController.resetPassword(new ResetPasswordRequestDto());
      }
      const endTime = performance.now();
      console.log(
        `Time taken for 1000 password reset requests: ${endTime - startTime}ms`,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should return a success message on successful forgot password request', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.RESET_PASSWORD_TOKEN_SENT,
      };
      jest.spyOn(authService, 'forgotPassword').mockResolvedValue(result);

      expect(
        await authController.forgotPassword(new ForgotPasswordRequestDto()),
      ).toBe(result);
    });

    it('should throw an error on invalid forgot password request', async () => {
      jest
        .spyOn(authService, 'forgotPassword')
        .mockRejectedValue(new Error(MESSAGE.USER_NOT_FOUND));
      await expect(
        authController.forgotPassword(new ForgotPasswordRequestDto()),
      ).rejects.toThrow(MESSAGE.USER_NOT_FOUND);
    });

    it('should handle non-existent email in forgot password request', async () => {
      const forgotPasswordDto = new ForgotPasswordRequestDto();
      forgotPasswordDto.email = 'nonexistent@example.com';
      jest
        .spyOn(authService, 'forgotPassword')
        .mockRejectedValue(new Error(MESSAGE.USER_NOT_FOUND));
      await expect(
        authController.forgotPassword(forgotPasswordDto),
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
        await authController.forgotPassword(new ForgotPasswordRequestDto());
      }
      const endTime = performance.now();
      console.log(
        `Time taken for 1000 forgot password requests: ${endTime - startTime}ms`,
      );
    });
  });

  describe('verifyEmail', () => {
    it('should return a success message on successful email verification', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.USER_VERIFIED_SUCCESS,
      };
      jest.spyOn(authService, 'verifyEmail').mockResolvedValue(result);

      expect(await authController.verifyEmail('token')).toBe(result);
    });

    it('should throw an error on invalid email verification', async () => {
      jest
        .spyOn(authService, 'verifyEmail')
        .mockRejectedValue(new Error(MESSAGE.INVALID_TOKEN));
      await expect(authController.verifyEmail('token')).rejects.toThrow(
        MESSAGE.INVALID_TOKEN,
      );
    });

    it('should handle expired token in email verification', async () => {
      jest
        .spyOn(authService, 'verifyEmail')
        .mockRejectedValue(new Error(MESSAGE.TOKEN_EXPIRED));
      await expect(authController.verifyEmail('expired-token')).rejects.toThrow(
        MESSAGE.TOKEN_EXPIRED,
      );
    });

    it('should measure performance for multiple email verifications', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.USER_VERIFIED_SUCCESS,
      };
      jest.spyOn(authService, 'verifyEmail').mockResolvedValue(result);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        await authController.verifyEmail('token');
      }
      const endTime = performance.now();
      console.log(
        `Time taken for 1000 email verifications: ${endTime - startTime}ms`,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return a new JWT token on successful token refresh', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.REFRESH_TOKEN_SUCCESS,
        data: { token: 'jwt-token' },
      };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(result);

      expect(
        await authController.refreshToken({
          refreshToken: 'valid-refresh-token',
        }),
      ).toBe(result);
    });

    it('should throw an error on invalid token refresh', async () => {
      jest
        .spyOn(authService, 'refreshToken')
        .mockRejectedValue(new Error(MESSAGE.INVALID_TOKEN));
      await expect(
        authController.refreshToken({ refreshToken: 'invalid-refresh-token' }),
      ).rejects.toThrow(MESSAGE.INVALID_TOKEN);
    });

    it('should handle expired refresh token', async () => {
      jest
        .spyOn(authService, 'refreshToken')
        .mockRejectedValue(new Error(MESSAGE.TOKEN_EXPIRED));
      await expect(
        authController.refreshToken({ refreshToken: 'expired-refresh-token' }),
      ).rejects.toThrow(MESSAGE.TOKEN_EXPIRED);
    });

    it('should measure performance for multiple token refresh requests', async () => {
      const result: ResponseDto = {
        statusCode: 200,
        message: MESSAGE.REFRESH_TOKEN_SUCCESS,
        data: { token: 'jwt-token' },
      };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(result);

      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        await authController.refreshToken({
          refreshToken: 'valid-refresh-token',
        });
      }
      const endTime = performance.now();
      console.log(
        `Time taken for 1000 token refresh requests: ${endTime - startTime}ms`,
      );
    });
  });
});

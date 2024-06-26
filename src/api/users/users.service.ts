import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User } from './models/user.model';
import ResponseDto from '../../util/response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorHandlerService } from '../../util/error-handler.service';
import { MESSAGE } from '../../constant/message';
import * as cloudinary from 'cloudinary';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly configService: ConfigService,
  ) {
    cloudinary.v2.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(userId, updateUserDto, { new: true })
        .select({ password: 0 });
      if (!user) {
        throw new HttpException(MESSAGE.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.USER_UPDATE_SUCCESS,
        data: user,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async updateProfileImage(userId: string, file: any): Promise<ResponseDto> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new HttpException(MESSAGE.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      if (user.avatar) {
        await cloudinary.v2.uploader.destroy(user.avatar);
      }

      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      const result = await cloudinary.v2.uploader.upload(dataUrl, {
        folder: 'avatar',
      });
      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, { avatar: result.secure_url }, { new: true })
        .select({ password: 0 });

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.USER_UPDATE_SUCCESS,
        data: updatedUser,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async getProfile(userId: string): Promise<ResponseDto> {
    try {
      const user = await this.userModel
        .findById(userId)
        .select({ password: 0 });
      if (!user) {
        throw new HttpException(MESSAGE.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.USER_FETCH_SUCCESS,
        data: user,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async getInstructorProfile(id: string): Promise<ResponseDto> {
    try {
      const user = await this.userModel.findById(id).select({ password: 0 });
      if (!user) {
        throw new HttpException(MESSAGE.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.INSTRUCTOR_FETCH_SUCCESS,
        data: user,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}

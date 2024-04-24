import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import ResponseDto from 'src/util/response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorHandlerService } from 'src/util/error-handler.service';
import { MESSAGE } from 'src/constant/message';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto> {
    try {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        updateUserDto,
        { new: true },
      );
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
}

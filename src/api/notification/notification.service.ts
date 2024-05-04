import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { Notification } from './model/notification.model';
import { ErrorHandlerService } from '../../util/error-handler.service';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async getAllNotification(userId: string): Promise<ResponseDto> {
    try {
      let notifications;
      notifications = await this.cacheManager.get(`notifications-${userId}`);
      if (!notifications) {
        notifications = await this.notificationModel.find({
          user: userId,
        });
        await this.cacheManager.set(`notifications-${userId}`, notifications);
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.NOTIFICATION_FETCHED_SUCCESS,
        data: notifications,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async markAsRead(userId: string): Promise<ResponseDto> {
    try {
      await this.notificationModel.updateMany(
        { user: userId },
        { isRead: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.NOTIFICATION_MARKED_AS_READ,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}

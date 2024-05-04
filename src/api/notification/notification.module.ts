import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Notification, NotificationModel } from './model/notification.model';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ErrorHandlerService } from '../../util/error-handler.service';
import { User, UserModel } from '../users/models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationModel },
      { name: User.name, schema: UserModel },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, JwtService, ErrorHandlerService],
})
export class NotificationModule {}

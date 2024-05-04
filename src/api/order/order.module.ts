import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderModel } from './models/order.model';
import { User, UserModel } from '../users/models/user.model';
import { Course, CourseModel } from '../course/models/course.model';
import {
  Notification,
  NotificationModel,
} from '../notification/model/notification.model';
import { ErrorHandlerService } from '../../util/error-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderModel },
      { name: User.name, schema: UserModel },
      { name: Course.name, schema: CourseModel },
      { name: Notification.name, schema: NotificationModel },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService, ErrorHandlerService],
})
export class OrderModule {}

import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Order, OrderDocument } from './models/order.model';
import { Course, CourseDocument } from '../course/models/course.model';
import { User, UserDocument } from '../users/models/user.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { ErrorHandlerService } from '../../util/error-handler.service';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';

@Injectable()
export class OrderService {
  private readonly stripe: Stripe;
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-04-10',
    });
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<ResponseDto> {
    try {
      const { user, course } = createOrderDto;
      const userData = await this.userModel.findById(user);
      const courseData = await this.courseModel.findById(course);
      if (!courseData) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.COURSE_NOT_FOUND,
        };
      }
      const order = await this.orderModel.findOne({
        user,
        course,
        status: 'completed',
      });
      if (order) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: MESSAGE.COURSE_ALREADY_PURCHASED,
        };
      }
      if (courseData.price === 0) {
        await this.orderModel.create({
          user: user,
          course: course,
          amount: courseData.price,
          status: 'completed',
          transactionId: 'free',
        });
        return {
          statusCode: HttpStatus.CREATED,
          message: MESSAGE.ORDER_CREATED_SUCCESS,
          data: 'free',
        };
      }
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Course Purchase',
                description: `Payment for course: ${courseData.title}`,
              },
              unit_amount: courseData.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/cancel`,
        customer_email: userData.email,
        metadata: {
          course,
        },
      });

      await this.orderModel.create({
        user: user,
        course: course,
        amount: courseData.price,
        status: 'pending',
        transactionId: session.id,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.ORDER_CREATED_SUCCESS,
        data: session.url,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async findUserOrders(user: string): Promise<ResponseDto> {
    try {
      const orders = await this.orderModel.find({ user });
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ORDER_FETCHED_SUCCESS,
        data: orders,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async handleStripeWebhook(body: any) {
    switch (body.type) {
      case 'checkout.session.completed':
        const session = body.data.object;
        await this.orderModel.findOneAndUpdate(
          { transactionId: session.id },
          { status: 'completed' },
        );
        await this.courseModel.findByIdAndUpdate(session.metadata.course, {
          $inc: { totalSales: 1 },
        });
        break;
      case 'checkout.session.async_payment_failed':
        const failedSession = body.data.object;
        await this.orderModel.findOneAndUpdate(
          { transactionId: failedSession.id },
          { status: 'failed' },
        );
        break;
    }

    return { received: true };
  }
}

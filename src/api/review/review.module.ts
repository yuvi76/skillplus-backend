import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Review, ReviewModel } from './models/review.model';
import { User, UserModel } from '../users/models/user.model';
import { Course, CourseModel } from '../course/models/course.model';
import { ErrorHandlerService } from '../../util/error-handler.service';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewModel },
      { name: User.name, schema: UserModel },
      { name: Course.name, schema: CourseModel },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, JwtService, ErrorHandlerService],
})
export class ReviewModule {}

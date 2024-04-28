import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Review } from './models/review.model';
import { Course } from '../course/models/course.model';
import { User } from '../users/models/user.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetReviewListDto } from './dto/get-review-list.dto';
import { ErrorHandlerService } from '../../util/error-handler.service';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<ResponseDto> {
    try {
      const { course, user } = createReviewDto;
      const courseDetail = await this.courseModel.findById(course);
      if (!courseDetail) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.COURSE_NOT_FOUND,
        };
      }
      const userDetail = await this.userModel.findById(user);
      if (!userDetail) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.USER_NOT_FOUND,
        };
      }
      const reviewExist = await this.reviewModel.findOne({ course, user });
      if (reviewExist) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: MESSAGE.REVIEW_ALREADY_EXISTS,
        };
      }
      const createdReview = new this.reviewModel(createReviewDto);
      courseDetail.reviews.push(createdReview._id.toString());
      await courseDetail.save();
      await createdReview.save();
      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.REVIEW_CREATED_SUCCESS,
        data: createdReview,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async findAll(getReviewListDto: GetReviewListDto): Promise<ResponseDto> {
    try {
      const { course } = getReviewListDto;
      if (!course) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.COURSE_NOT_FOUND,
        };
      }

      const isCacheAvailable = await this.cacheManager.get(`${course}-reviews`);
      if (isCacheAvailable) {
        return {
          statusCode: HttpStatus.OK,
          message: MESSAGE.REVIEW_FETCHED_SUCCESS,
          data: isCacheAvailable,
        };
      } else {
        const reviews = await this.reviewModel
          .find({ course })
          .populate('course', ['_id', 'name'])
          .populate('user', ['_id', 'name']);

        await this.cacheManager.set(`${course}-reviews`, reviews, 60);

        return {
          statusCode: HttpStatus.OK,
          message: MESSAGE.REVIEW_FETCHED_SUCCESS,
          data: reviews,
        };
      }
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async findOne(id: string): Promise<ResponseDto> {
    try {
      const review = await this.reviewModel.findById(id);
      if (!review) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.REVIEW_NOT_FOUND,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.REVIEW_FETCHED_SUCCESS,
        data: review,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ResponseDto> {
    try {
      const updatedReview = await this.reviewModel.findByIdAndUpdate(
        id,
        updateReviewDto,
        { new: true },
      );
      if (!updatedReview) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.REVIEW_NOT_FOUND,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.REVIEW_UPDATED_SUCCESS,
        data: updatedReview,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async remove(id: string): Promise<ResponseDto> {
    try {
      const review = await this.reviewModel.findByIdAndDelete(id);
      if (!review) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.REVIEW_NOT_FOUND,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.REVIEW_DELETED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async reply(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ResponseDto> {
    try {
      const { repliedBy } = updateReviewDto;
      const [review] = await this.reviewModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'course',
            foreignField: '_id',
            as: 'course',
          },
        },
        { $unwind: '$course' },
      ]);
      if (!review) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.REVIEW_NOT_FOUND,
        };
      }
      if (repliedBy !== review.course.instructor.toString()) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: MESSAGE.UNAUTHORIZED,
        };
      }

      const reply = await this.reviewModel.findById(id);
      reply.reply = updateReviewDto.reply;
      reply.repliedBy = repliedBy;
      await reply.save();
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.REVIEW_REPLIED_SUCCESS,
        data: reply,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}

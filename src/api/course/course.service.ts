import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './models/course.model';
import { User } from '../users/models/user.model';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCourseListDto } from './dto/get-course-list.dto';
import { ErrorHandlerService } from '../../util/error-handler.service';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<ResponseDto> {
    try {
      const { title } = createCourseDto;
      const course = await this.courseModel.findOne({ title });
      if (course) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: MESSAGE.COURSE_ALREADY_EXISTS,
        };
      }
      const createdCourse = new this.courseModel(createCourseDto);
      await createdCourse.save();
      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.COURSE_CREATED_SUCCESS,
        data: createdCourse,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async findAll(getCourseListDto: GetCourseListDto): Promise<ResponseDto> {
    try {
      const {
        page,
        limit,
        search,
        category,
        instructor,
        language,
        tags,
        sort,
        order,
        price,
      } = getCourseListDto;

      // Match stage to apply filters
      const matchStage = {};
      if (search) {
        matchStage['title'] = { $regex: search, $options: 'i' };
      }
      if (category) {
        matchStage['category'] = category;
      }
      if (instructor) {
        matchStage['instructor'] = instructor;
      }
      if (language) {
        matchStage['language'] = language;
      }
      if (tags) {
        matchStage['tags'] = { $in: tags };
      }
      if (price) {
        matchStage['price'] = price;
      }

      const sortStage = {};
      sortStage[sort] = order === 'asc' ? 1 : -1;

      const skipStage = { $skip: (page - 1) * limit };
      const limitStage = { $limit: limit };

      const pipeline: any = [
        { $match: matchStage },
        {
          $facet: {
            courses: [sortStage, skipStage, limitStage],
            totalCount: [{ $count: 'count' }],
          },
        },
      ];

      const results = await this.courseModel.aggregate(pipeline);
      const { courses, totalCount } = results[0];
      const totalCourses = totalCount[0] ? totalCount[0].count : 0;
      const totalPages = Math.ceil(totalCourses / limit);

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.COURSE_LIST_FETCHED_SUCCESS,
        data: {
          courses,
          totalCourses: totalCourses[0]?.totalCourses || 0,
          totalPages,
        },
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async findById(id: string): Promise<ResponseDto> {
    try {
      const course = await this.courseModel.findById(id);
      if (!course) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.COURSE_NOT_FOUND,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.COURSE_DETAILS_FETCHED_SUCCESS,
        data: course,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<ResponseDto> {
    try {
      if (updateCourseDto.title) {
        const course = await this.courseModel.findOne({
          title: updateCourseDto.title,
        });
        if (course) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: MESSAGE.COURSE_ALREADY_EXISTS,
          };
        }
      }

      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        id,
        updateCourseDto,
        { new: true },
      );
      if (!updatedCourse) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.COURSE_NOT_FOUND,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.COURSE_UPDATED_SUCCESS,
        data: updatedCourse,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async remove(id: string): Promise<ResponseDto> {
    try {
      const deletedCourse = await this.courseModel.findByIdAndDelete(id);
      if (!deletedCourse) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.COURSE_NOT_FOUND,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.COURSE_DELETED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async enroll(userId: string, courseId: string): Promise<ResponseDto> {
    try {
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.COURSE_NOT_FOUND,
        };
      }
      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.USER_NOT_FOUND,
        };
      }
      if (course.students.includes(userId)) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: MESSAGE.COURSE_ALREADY_ENROLLED,
        };
      }
      course.students.push(userId);
      await course.save();
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.COURSE_ENROLLED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  // async addReview(
  //   courseId: string,
  //   userId: string,
  //   reviewDto: any,
  // ): Promise<ResponseDto> {
  //   // Implement adding a review
  //   return { statusCode: 200, message: 'Review added successfully' };
  // }

  // async updateProgress(
  //   courseId: string,
  //   userId: string,
  //   progressDto: any,
  // ): Promise<ResponseDto> {
  //   // Implement updating course progress
  //   return { statusCode: 200, message: 'Progress updated successfully' };
  // }
}

import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Course } from './models/course.model';
import { User } from '../users/models/user.model';
import { Content } from '../content/models/content.model';
import { Progress } from '../progress/models/progress.model';
import { Notification } from '../notification/model/notification.model';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCourseListDto } from './dto/get-course-list.dto';
import { ErrorHandlerService } from '../../util/error-handler.service';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';

@Injectable()
export class CourseService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Content.name) private readonly contentModel: Model<Content>,
    @InjectModel(Progress.name) private readonly progressModel: Model<Progress>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
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
        matchStage['instructor'] = { $regex: instructor, $options: 'i' };
      }
      if (language) {
        matchStage['language'] = language;
      }
      if (tags) {
        matchStage['tags'] = { $in: tags };
      }

      const sortStage = {};
      sortStage[sort] = order === 'asc' ? 1 : -1;

      const skipStage = { $skip: (page - 1) * limit };
      const limitStage = { $limit: limit };

      const pipeline: any = [
        {
          $lookup: {
            from: 'users',
            localField: 'instructor',
            foreignField: '_id',
            as: 'instructor',
          },
        },
        { $unwind: '$instructor' },
        { $addFields: { instructor: '$instructor.username' } },
        { $match: matchStage },
        {
          $facet: {
            courses: [skipStage, limitStage],
            totalCount: [{ $count: 'count' }],
          },
        },
      ];

      const [results] = await this.courseModel.aggregate(pipeline);
      const { courses, totalCount } = results;
      const totalCourses = totalCount[0] ? totalCount[0].count : 0;
      const totalPages = Math.ceil(totalCourses / limit);

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.COURSE_LIST_FETCHED_SUCCESS,
        data: {
          courses,
          totalCourses: totalCourses,
          totalPages,
        },
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async findById(id: string): Promise<ResponseDto> {
    try {
      const isCacheAvailable = await this.cacheManager.get(id);
      if (isCacheAvailable) {
        return {
          statusCode: HttpStatus.OK,
          message: MESSAGE.COURSE_DETAILS_FETCHED_SUCCESS,
          data: isCacheAvailable,
        };
      } else {
        const course = await this.courseModel.findById(id);
        if (!course) {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: MESSAGE.COURSE_NOT_FOUND,
          };
        }
        await this.cacheManager.set(id, course, 60);

        return {
          statusCode: HttpStatus.OK,
          message: MESSAGE.COURSE_DETAILS_FETCHED_SUCCESS,
          data: course,
        };
      }
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
          _id: { $ne: id },
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
      await this.userModel.updateMany(
        { courses: id },
        { $pull: { courses: id } },
      );
      await this.contentModel.deleteMany({ course: id });
      await this.cacheManager.del(id);

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
      const course = await this.courseModel.findById(courseId).populate({
        path: 'content',
        populate: {
          path: 'lectures',
        },
      });
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
      if (course.students.includes(userId) && user.courses.includes(courseId)) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: MESSAGE.COURSE_ALREADY_ENROLLED,
        };
      }
      course.students.push(userId);
      user.courses.push(courseId);

      const Progress = new this.progressModel({
        user: userId,
        course: courseId,
        contentsProgress: course.content.map((content: any) => ({
          content: content._id,
          lecturesProgress: content.lectures.map((lecture: any) => ({
            lecture: lecture._id,
            completed: false,
          })),
        })),
      });

      const notification = new this.notificationModel({
        user: course.instructor,
        title: 'New Course Enrollment',
        description: `${user.username} enrolled in your course ${course.title}`,
        type: 'course',
      });
      await course.save();
      await user.save();
      await Progress.save();
      await notification.save();
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.COURSE_ENROLLED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}

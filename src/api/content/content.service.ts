import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content } from './models/content.model';
import { Course } from '../course/models/course.model';
import { Lecture } from '../lecture/models/lecture.model';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ErrorHandlerService } from '../../util/error-handler.service';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private readonly contentModel: Model<Content>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(Lecture.name) private readonly lectureModel: Model<Lecture>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<ResponseDto> {
    try {
      const { title, course, instructor } = createContentDto;
      const courseDetail = await this.courseModel.findOne({
        _id: course,
        instructor,
      });
      if (!courseDetail) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.COURSE_NOT_FOUND,
        };
      }
      const content = await this.contentModel.findOne({ title });
      if (content) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: MESSAGE.CONTENT_ALREADY_EXISTS,
        };
      }
      const createdContent = new this.contentModel(createContentDto);
      await createdContent.save();
      courseDetail.content.push(createdContent._id.toString());
      await courseDetail.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.CONTENT_CREATED_SUCCESS,
        data: createdContent,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async update(
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<ResponseDto> {
    try {
      const content = await this.contentModel.findOneAndUpdate(
        { _id: id },
        updateContentDto,
        { new: true },
      );
      if (!content) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.CONTENT_NOT_FOUND,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.CONTENT_UPDATED_SUCCESS,
        data: content,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async delete(id: string): Promise<ResponseDto> {
    try {
      const content = await this.contentModel.findByIdAndDelete(id);
      if (!content) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.CONTENT_NOT_FOUND,
        };
      }
      const course = await this.courseModel.findById(content.course);
      course.content = course.content.filter((item) => item.toString() !== id);
      await course.save();

      await this.lectureModel.deleteMany({ content: id });

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.CONTENT_DELETED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}

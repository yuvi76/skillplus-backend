import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content } from '../content/models/content.model';
import { Lecture } from './models/lecture.model';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { ErrorHandlerService } from '../../util/error-handler.service';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';

@Injectable()
export class LectureService {
  constructor(
    @InjectModel(Lecture.name) private readonly lectureModel: Model<Lecture>,
    @InjectModel(Content.name) private readonly contentModel: Model<Content>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async create(createLectureDto: CreateLectureDto): Promise<ResponseDto> {
    try {
      const { title, content } = createLectureDto;
      const contentDetail = await this.contentModel.findOne({
        _id: content,
      });
      if (!contentDetail) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.CONTENT_NOT_FOUND,
        };
      }
      const lecture = await this.lectureModel.findOne({ title });
      if (lecture) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: MESSAGE.LECTURE_ALREADY_EXISTS,
        };
      }
      const createdLecture = new this.lectureModel(createLectureDto);
      await createdLecture.save();
      contentDetail.lectures.push(createdLecture._id.toString());
      await contentDetail.save();

      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.LECTURE_CREATED_SUCCESS,
        data: createdLecture,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async update(
    id: string,
    updateLectureDto: UpdateLectureDto,
  ): Promise<ResponseDto> {
    try {
      const { title, content } = updateLectureDto;
      const contentDetail = await this.contentModel.findOne({
        _id: content,
      });
      if (!contentDetail) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.CONTENT_NOT_FOUND,
        };
      }
      const lecture = await this.lectureModel.findOne({ title });
      if (lecture) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: MESSAGE.LECTURE_ALREADY_EXISTS,
        };
      }
      await this.lectureModel.findByIdAndUpdate(id, updateLectureDto);
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.LECTURE_UPDATED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async delete(id: string): Promise<ResponseDto> {
    try {
      const lecture = await this.lectureModel.findByIdAndDelete(id);
      if (!lecture) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: MESSAGE.LECTURE_NOT_FOUND,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.LECTURE_DELETED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}

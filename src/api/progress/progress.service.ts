import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from './models/progress.model';
import { CreateProgressDto } from './dto/create-progress.dto';
import { ErrorHandlerService } from '../../util/error-handler.service';
import ResponseDto from '../../util/response.dto';
import { MESSAGE } from '../../constant/message';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async markLectureComplete(
    user: string,
    createProgressDto: CreateProgressDto,
  ): Promise<ResponseDto> {
    try {
      const { course, content, lecture } = createProgressDto;
      const progress = await this.progressModel.findOne({
        user,
        course,
      });
      const contentIndex = progress.contentsProgress.findIndex(
        (c) => c.content.toString() === content,
      );
      const lectureIndex = progress.contentsProgress[
        contentIndex
      ].lecturesProgress.findIndex((l) => l.lecture.toString() === lecture);

      progress.contentsProgress[contentIndex].lecturesProgress[
        lectureIndex
      ].completed = true;

      const isAllLecturesCompleted = progress.contentsProgress[
        contentIndex
      ].lecturesProgress.every((l) => l.completed);
      if (isAllLecturesCompleted) {
        progress.contentsProgress[contentIndex].completed = true;
      }

      const isAllContentsCompleted = progress.contentsProgress.every(
        (c) => c.completed,
      );
      if (isAllContentsCompleted) {
        progress.courseCompleted = true;
      }

      await progress.save();
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.PROGRESS_UPDATED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}

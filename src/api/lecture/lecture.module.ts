import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { Lecture, LectureModel } from './models/lecture.model';
import { Content, ContentModel } from '../content/models/content.model';
import { ErrorHandlerService } from '../../util/error-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lecture.name, schema: LectureModel },
      { name: Content.name, schema: ContentModel },
    ]),
  ],
  controllers: [LectureController],
  providers: [LectureService, JwtService, ErrorHandlerService],
})
export class LectureModule {}

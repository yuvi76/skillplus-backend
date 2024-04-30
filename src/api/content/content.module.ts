import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content, ContentModel } from './models/content.model';
import { Course, CourseModel } from '../course/models/course.model';
import { User, UserModel } from '../users/models/user.model';
import { Lecture, LectureModel } from '../lecture/models/lecture.model';
import { ErrorHandlerService } from '../../util/error-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentModel },
      { name: Course.name, schema: CourseModel },
      { name: User.name, schema: UserModel },
      { name: Lecture.name, schema: LectureModel },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService, JwtService, ErrorHandlerService],
})
export class ContentModule {}

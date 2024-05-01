import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course, CourseModel } from './models/course.model';
import { User, UserModel } from '../users/models/user.model';
import { Content, ContentModel } from '../content/models/content.model';
import { Progress, ProgressModel } from '../progress/models/progress.model';
import { ErrorHandlerService } from '../../util/error-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseModel },
      { name: User.name, schema: UserModel },
      { name: Content.name, schema: ContentModel },
      { name: Progress.name, schema: ProgressModel },
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService, JwtService, ErrorHandlerService],
})
export class CourseModule {}

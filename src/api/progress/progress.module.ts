import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { Progress, ProgressModel } from './models/progress.model';
import { ErrorHandlerService } from '../../util/error-handler.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressModel }]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService, JwtService, ErrorHandlerService],
})
export class ProgressModule {}

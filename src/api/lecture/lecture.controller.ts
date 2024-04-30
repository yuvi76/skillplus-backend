import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { RolesGuard } from '../auth/guard/role.guard';
import { ROLE } from '../../enum/role.enum';
import ResponseDto from '../../util/response.dto';

@Controller('lecture')
@ApiTags('Lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.INSTRUCTOR])
  @ApiBearerAuth()
  async createLecture(
    @Body() createLectureDto: CreateLectureDto,
  ): Promise<ResponseDto> {
    return this.lectureService.create(createLectureDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.INSTRUCTOR])
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateLectureDto: UpdateLectureDto,
  ): Promise<ResponseDto> {
    return this.lectureService.update(id, updateLectureDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.INSTRUCTOR])
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<ResponseDto> {
    return this.lectureService.delete(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCourseListDto } from './dto/get-course-list.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/role.guard';
import { ROLE } from '../../enum/role.enum';
import ResponseDto from '../../util/response.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.INSTRUCTOR])
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<ResponseDto> {
    return this.courseService.create(createCourseDto);
  }

  @Post()
  async getCourses(
    @Body() getCourseListDto: GetCourseListDto,
  ): Promise<ResponseDto> {
    return this.courseService.findAll(getCourseListDto);
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string): Promise<ResponseDto> {
    return this.courseService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.INSTRUCTOR])
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<ResponseDto> {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.ADMIN, ROLE.INSTRUCTOR])
  async deleteCourse(@Param('id') id: string): Promise<ResponseDto> {
    return this.courseService.remove(id);
  }

  @Post(':id/enroll')
  @UseGuards(AuthGuard('jwt'))
  async enrollInCourse(
    @Req() req: any,
    @Param('id') courseId: string,
  ): Promise<ResponseDto> {
    return this.courseService.enroll(req.user.id, courseId);
  }

  // @Post(':id/review')
  // @UseGuards(AuthGuard('jwt'))
  // async addReview(
  //   @Req() req,
  //   @Param('id') courseId: string,
  //   @Body() reviewDto: any,
  // ): Promise<ResponseDto> {
  //   // Define ReviewDto
  //   return this.courseService.addReview(courseId, req.user.id, reviewDto);
  // }

  // @Put(':id/progress')
  // @UseGuards(AuthGuard('jwt'))
  // async updateProgress(
  //   @Req() req,
  //   @Param('id') courseId: string,
  //   @Body() progressDto: any,
  // ): Promise<ResponseDto> {
  //   // Define ProgressDto
  //   return this.courseService.updateProgress(
  //     courseId,
  //     req.user.id,
  //     progressDto,
  //   );
  // }
}

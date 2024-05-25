import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { RolesGuard } from '../auth/guard/role.guard';
import { ROLE } from '../../enum/role.enum';
import ResponseDto from '../../util/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('lecture')
@ApiTags('Lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.INSTRUCTOR])
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(mp4|avi|mkv)$/)) {
          return callback(new Error('Only video files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        createLectureDto: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            order: {
              type: 'number',
            },
            duration: {
              type: 'string',
            },
            isPreview: {
              type: 'boolean',
            },
            resources: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  async createLecture(
    @Body() createLectureDto: CreateLectureDto,
    @UploadedFile() file: any,
  ): Promise<ResponseDto> {
    return this.lectureService.create(createLectureDto, file);
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

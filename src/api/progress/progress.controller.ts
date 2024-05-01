import {
  Controller,
  Post,
  UseGuards,
  SetMetadata,
  Req,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { RolesGuard } from '../auth/guard/role.guard';
import { ROLE } from '../../enum/role.enum';
import { CreateProgressDto } from './dto/create-progress.dto';
import ResponseDto from '../../util/response.dto';

@Controller('progress')
@ApiTags('Progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('mark-lecture-complete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.USER])
  @ApiBearerAuth()
  async markLectureComplete(
    @Req() req: any,
    @Body() createProgressDto: CreateProgressDto,
  ): Promise<ResponseDto> {
    return this.progressService.markLectureComplete(
      req.user.userId,
      createProgressDto,
    );
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetReviewListDto } from './dto/get-review-list.dto';
import { RolesGuard } from '../auth/guard/role.guard';
import { ROLE } from '../../enum/role.enum';
import ResponseDto from '../../util/response.dto';

@Controller('review')
@ApiTags('Review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.USER])
  @ApiBearerAuth()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: any,
  ): Promise<ResponseDto> {
    createReviewDto.user = req.user.userId;
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  async findAll(getReviewListDto: GetReviewListDto): Promise<ResponseDto> {
    return this.reviewService.findAll(getReviewListDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.USER])
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ResponseDto> {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.USER, ROLE.ADMIN, ROLE.INSTRUCTOR])
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<ResponseDto> {
    return this.reviewService.remove(id);
  }

  @Post('reply/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.USER])
  @ApiBearerAuth()
  async reply(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any,
  ): Promise<ResponseDto> {
    updateReviewDto.repliedBy = req.user.userId;
    return this.reviewService.reply(id, updateReviewDto);
  }
}

import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/role.guard';
import { ROLE } from '../../enum/role.enum';
import ResponseDto from '../../util/response.dto';

@Controller('content')
@ApiTags('Content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.INSTRUCTOR])
  @ApiBearerAuth()
  async createContent(
    @Req() req: any,
    @Body() createContentDto: CreateContentDto,
  ): Promise<ResponseDto> {
    createContentDto.instructor = req.user.userId;
    return this.contentService.create(createContentDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.INSTRUCTOR])
  @ApiBearerAuth()
  async updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ): Promise<ResponseDto> {
    return this.contentService.update(id, updateContentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', [ROLE.INSTRUCTOR])
  @ApiBearerAuth()
  async deleteContent(@Param('id') id: string): Promise<ResponseDto> {
    return this.contentService.delete(id);
  }
}

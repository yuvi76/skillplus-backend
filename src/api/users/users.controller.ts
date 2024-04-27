import {
  Controller,
  Put,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SetMetadata } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../auth/guard/role.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import ResponseDto from '../../util/response.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['user'])
  @ApiBearerAuth()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ): Promise<ResponseDto> {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @Put('update-avatar')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['user'])
  @UseInterceptors(FileInterceptor('file'))
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
      },
    },
  })
  async updateProfileImage(
    @UploadedFile() file: any,
    @Req() req: any,
  ): Promise<ResponseDto> {
    return this.usersService.updateProfileImage(req.user.userId, file);
  }
}

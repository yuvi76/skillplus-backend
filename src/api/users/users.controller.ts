import { Controller, Put, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SetMetadata } from '@nestjs/common';
import { RolesGuard } from '../auth/guard/role.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import ResponseDto from 'src/util/response.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['user'])
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ): Promise<ResponseDto> {
    return this.usersService.update(req.user.userId, updateUserDto);
  }
}

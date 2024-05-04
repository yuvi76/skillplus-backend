import { Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';
import ResponseDto from '../../util/response.dto';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getAllNotification(@Req() req: any): Promise<ResponseDto> {
    return this.notificationService.getAllNotification(req.user.userId);
  }

  @Put('mark-as-read')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async markAsRead(@Req() req: any): Promise<ResponseDto> {
    return this.notificationService.markAsRead(req.user.userId);
  }
}

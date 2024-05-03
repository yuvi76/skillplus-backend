import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import ResponseDto from '../../util/response.dto';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async createOrder(
    @Req() req: any,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseDto> {
    createOrderDto.user = req.user.userId;
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async findUserOrders(@Req() req: any): Promise<ResponseDto> {
    return this.orderService.findUserOrders(req.user.userId);
  }

  @Post('/webhook')
  async handleStripeWebhook(@Body() body: any) {
    return this.orderService.handleStripeWebhook(body);
  }
}

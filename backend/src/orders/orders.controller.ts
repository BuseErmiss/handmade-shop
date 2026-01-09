import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
// Kullanılmayan Patch ve UpdateOrderDto importları kaldırıldı

// DİKKAT: Eğer bu dosya yolunda hata alıyorsan, Auth modülündeki Guard dosya yolunu kontrol etmelisin.
// Eğer henüz JwtAuthGuard dosyan yoksa bu satırı geçici olarak yorum satırı yapabilirsin.
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post(':id/checkout')
  checkout(@Param('id') id: string, @Body('userId') userId: number) {
    return this.ordersService.checkout(+id, userId);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Delete('item/:productId')
  removeItem(
    @Param('productId') productId: string,
    @Query('userId') userId: string,
  ) {
    return this.ordersService.removeItem(Number(userId), Number(productId));
  }
}

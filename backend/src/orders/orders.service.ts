import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const { userId, items } = createOrderDto;

    // 1. Yeni sipariş oluştur (Draft/Taslak olarak başlar)
    const order = this.ordersRepository.create({
      userId,
      status: 'Draft',
      totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    });

    const savedOrder = await this.ordersRepository.save(order);

    // 2. Sipariş kalemlerini oluştur ve kaydet
    const orderItems = items.map((item) => {
      return this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.price,
      });
    });

    await this.orderItemRepository.save(orderItems);

    // İlişkileriyle birlikte geri dön (Frontend'de görünmesi için kritik)
    return await this.findOne(savedOrder.id);
  }

  async findAll() {
    return await this.ordersRepository.find({
      relations: ['items', 'items.product'], // Ürün bilgilerini çekmek için zorunlu
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException(`Sipariş #${id} bulunamadı.`);
    return order;
  }

  async removeItem(productId: number, userId: number) {
    // Await eklenerek ESLint hatası giderildi
    const order = await this.ordersRepository.findOne({
      where: { userId, status: 'Draft' },
      relations: ['items'],
    });

    if (order) {
      const itemToRemove = order.items.find((i) => i.productId === productId);
      if (itemToRemove) {
        await this.orderItemRepository.remove(itemToRemove);
        // Toplam fiyatı güncelle
        order.totalPrice -= itemToRemove.priceAtPurchase * itemToRemove.quantity;
        await this.ordersRepository.save(order);
      }
    }
    return { message: 'Ürün kaldırıldı' };
  }

  // backend/src/orders/orders.service.ts içinde checkout kısmını bul ve değiştir:

  async checkout(id: number, userId: number): Promise<Order> {
    // Siparişi hem ID hem de userId ile ara (Güvenlik için)
    const order = await this.ordersRepository.findOne({
      where: { id, userId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Sipariş #${id} bulunamadı veya bu kullanıcıya ait değil.`);
    }

    if (order.status === 'Tamamlandı') {
      return order; // Zaten tamamlanmışsa bir şey yapma
    }

    order.status = 'Tamamlandı';
    return await this.ordersRepository.save(order);
  }
}

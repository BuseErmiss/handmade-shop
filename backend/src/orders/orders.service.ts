import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    // 0️⃣ Kullanıcının aktif sepeti var mı bak
    let order = await this.orderRepository.findOne({
      where: {
        userId: createOrderDto.userId,
        status: 'Draft',
      },
      relations: ['items'],
    });
    // 3️⃣ Sipariş yoksa oluştur
    if (!order) {
      order = this.orderRepository.create({
        userId: createOrderDto.userId,
        totalPrice: 0,
        status: 'Draft',
      });

      order = await this.orderRepository.save(order);
    }

    // 1️⃣ Ürünleri birleştir
    const mergedItems = new Map<number, any>();

    for (const item of createOrderDto.items) {
      const productId = Number(item.productId);

      if (mergedItems.has(productId)) {
        mergedItems.get(productId).quantity += item.quantity;
      } else {
        mergedItems.set(productId, {
          ...item,
          productId: productId
        });
      }
    }

    // 2️⃣ Toplam fiyatı doğru hesapla
    const totalPrice = Array.from(mergedItems.values()).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    for (const item of mergedItems.values()) {
      const existingItem = order.items?.find(
        (i) => i.productId === item.productId
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
        await this.orderItemRepository.save(existingItem);
      } else {
        const orderItem = this.orderItemRepository.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.price
        });
        await this.orderItemRepository.save(orderItem);
      }
    }
    order.totalPrice += totalPrice;
    await this.orderRepository.save(order);

    return { message: 'Sipariş başarıyla oluşturuldu!', orderId: order.id };
  }

  async removeItem(userId: number, productId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        userId,
        status: 'Draft',
      },
      relations: ['items'],
    });

    if (!order) {
      throw new Error('Aktif sipariş bulunamadı');
    }

    if (!order.items || order.items.length === 0) {
      throw new Error('Siparişte ürün yok');
    }

    const item = order.items.find(
      (i) => i.productId === productId
    );

    if (!item) {
      throw new Error('Ürün siparişte bulunamadı');
    }

    // totalPrice güvenli azalt
    order.totalPrice = Math.max(
      0,
      order.totalPrice - item.priceAtPurchase * item.quantity
    );

    await this.orderItemRepository.remove(item);
    await this.orderRepository.save(order);

    return { message: 'Ürün sepetten silindi' };
  }


  findAll() {
    return this.orderRepository.find({ relations: ['items', 'items.product', 'user'] });
  }

  findOne(id: number) {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user']
    });
  }

  // Update ve remove şimdilik boş kalabilir veya silebilirsin
  update(id: number, updateOrderDto: any) { return `Update action`; }
  remove(id: number) { return `Delete action`; }
}

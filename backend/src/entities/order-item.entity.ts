import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('OrderItems')
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'OrderId' })
  orderId: number;

  @Column({ name: 'ProductId' })
  productId: number;

  @Column({ name: 'Quantity' })
  quantity: number;

  // DÜZELTME: Postgres'ten gelen string fiyatı sayıya çevirmek için transformer eklendi
  @Column({ 
    name: 'PriceAtPurchase', 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  priceAtPurchase: number;

  // İlişki: Detay -> Sipariş
  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'OrderId' })
  order: Order;

  // İlişki: Detay -> Ürün
  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'ProductId' })
  product: Product;
}
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

@Entity('Orders')
export class Order {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'UserId' })
  userId: number;

  @Column({
    name: 'TotalPrice',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  totalPrice: number;

  @Column({ name: 'Status', default: 'Draft' })
  status: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  // İlişki: Çok sipariş -> Bir kullanıcı
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'UserId' })
  user: User;

  // İlişki: Bir sipariş -> Çok detay
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}

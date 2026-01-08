import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity('Users') // Veritabanındaki tablo adı
export class User {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'FullName' })
  fullName: string;

  @Column({ name: 'Email' })
  email: string;

  @Column({ name: 'Password' })
  password: string;

  @Column({ name: 'Role', default: 'user' })
  role: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt: Date;

  // İlişki: Bir kullanıcı -> Çok sipariş
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
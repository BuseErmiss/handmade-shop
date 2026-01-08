import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';

@Entity('Products')
export class Product {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'Name' })
  name: string;

  @Column({ name: 'Price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'Stock' })
  stock: number;

  @Column({ name: 'ImageUrl', nullable: true })
  imageUrl: string;

  @Column({ name: 'CategoryId' })
  categoryId: number;

  // İlişki: Çok ürün -> Bir kategori
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'CategoryId' })
  category: Category;

  // İlişki: Ürün -> Sipariş Detayları
  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];
}
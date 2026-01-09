import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('Categories')
export class Category {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'Name' })
  name: string;

  @Column({ name: 'Description', nullable: true })
  description: string;

  // İlişki: Bir kategori -> Çok ürün
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}

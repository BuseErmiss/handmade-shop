import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    return await this.productRepository.save(newProduct);
  }

  findAll() {
    return this.productRepository.find({ order: { id: 'DESC' } }); // En yeni ürünler üstte
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Ürün (#${id}) bulunamadı.`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id); // Ürün yoksa NotFound fırlatır
    const updated = Object.assign(product, updateProductDto);
    return await this.productRepository.save(updated);
  }

  async remove(id: number) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Silinmek istenen ürün (#${id}) bulunamadı.`);
    }
    return { message: 'Ürün başarıyla silindi.' };
  }

  // Sipariş verildiğinde stok düşürmek için yardımcı metod
  async updateStock(id: number, quantity: number) {
    const product = await this.findOne(id);
    if (product.stock < quantity) {
      throw new Error('Yetersiz stok!');
    }
    product.stock -= quantity;
    return await this.productRepository.save(product);
  }
}

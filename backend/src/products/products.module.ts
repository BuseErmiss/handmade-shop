import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../entities/product.entity'; // Ana entity klasöründen

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Tabloyu bağladık
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
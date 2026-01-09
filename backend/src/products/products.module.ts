import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    // Resim yükleme kısıtlamaları için MulterModule (Opsiyonel ama önerilir)
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 1024 * 1024 * 5, // Maksimum 5MB
      },
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // OrdersModule gibi diğer modüller stok kontrolü için buna ihtiyaç duyabilir
})
export class ProductsModule {}

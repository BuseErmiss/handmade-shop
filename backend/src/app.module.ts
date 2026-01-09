import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Bu satır, NestJS'in dosyanın nerede olduğunu kesin olarak bulmasını sağlar
      envFilePath: process.cwd() + '/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // ÖNCELİK: Eğer DATABASE_URL varsa onu kullan (en güvenli yol)
      url: process.env.DATABASE_URL,
      // Yoksa tek tek parçaları dene
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Product, Order, OrderItem],
      synchronize: true,
      // DÜZELTME: Neon her zaman SSL ister, bu yüzden burayı sabitleyelim
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule { }
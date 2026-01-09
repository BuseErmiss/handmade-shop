import { IsNumber, IsArray, ValidateNested, IsNotEmpty, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Sipariş içindeki her bir ürünün kuralları
class OrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsPositive({ message: 'Adet 0’dan büyük olmalıdır.' })
  quantity: number;

  @IsNumber()
  @IsPositive({ message: 'Fiyat 0’dan büyük olmalıdır.' })
  price: number;
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true }) // Dizideki her elemanı kontrol et
  @Type(() => OrderItemDto) // Obje tipini belirt
  items: OrderItemDto[];
}

import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString({ message: 'Ürün adı metin formatında olmalıdır.' })
  @IsNotEmpty({ message: 'Ürün adı boş bırakılamaz.' })
  name: string;

  @IsNumber({}, { message: 'Fiyat bir sayı olmalıdır.' })
  @IsPositive({ message: 'Fiyat 0’dan büyük olmalıdır.' })
  @Type(() => Number) // FormData'dan string olarak gelebileceği için sayıya dönüştürür
  price: number;

  @IsNumber({}, { message: 'Stok bir sayı olmalıdır.' })
  @Min(0, { message: 'Stok 0’dan küçük olamaz.' })
  @Type(() => Number)
  stock: number;

  @IsNumber({}, { message: 'Kategori ID bir sayı olmalıdır.' })
  @IsNotEmpty()
  @Type(() => Number)
  categoryId: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

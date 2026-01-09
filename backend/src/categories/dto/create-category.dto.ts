import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Kategori adı metin formatında olmalıdır.' })
  @IsNotEmpty({ message: 'Kategori adı boş bırakılamaz.' })
  @MaxLength(50, { message: 'Kategori adı en fazla 50 karakter olabilir.' })
  name: string;

  @IsString({ message: 'Açıklama metin formatında olmalıdır.' })
  @IsOptional()
  @MaxLength(255, { message: 'Açıklama çok uzun.' })
  description?: string;
}

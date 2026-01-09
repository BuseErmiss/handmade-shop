import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Ad soyad metin formatında olmalıdır.' })
  @IsNotEmpty({ message: 'Ad soyad alanı boş bırakılamaz.' })
  fullName: string;

  @IsEmail({}, { message: 'Lütfen geçerli bir e-posta adresi giriniz.' })
  @IsNotEmpty({ message: 'E-posta alanı boş bırakılamaz.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Şifre alanı boş bırakılamaz.' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır.' })
  password: string;

  @IsOptional()
  @IsIn(['user', 'admin'], { message: 'Geçersiz rol tanımlaması.' })
  role?: 'user' | 'admin';
}

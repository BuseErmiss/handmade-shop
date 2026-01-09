import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'İsim soyisim metin formatında olmalıdır.' })
  @IsNotEmpty({ message: 'İsim soyisim alanı boş bırakılamaz.' })
  fullName: string;

  @IsEmail({}, { message: 'Lütfen geçerli bir e-posta adresi giriniz.' })
  @IsNotEmpty({ message: 'E-posta alanı boş bırakılamaz.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır.' })
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'user'], { message: 'Rol sadece admin veya user olabilir.' })
  role?: string;
}

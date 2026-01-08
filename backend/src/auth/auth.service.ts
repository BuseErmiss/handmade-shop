import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Login: Kullanıcı adı ve şifreyi kontrol et
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    // Kullanıcı varsa VE şifre eşleşiyorsa
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // Şifreyi sonuçtan çıkar, geri kalanı döndür
      return result;
    }
    return null;
  }

  // Token Üretme Fonksiyonu
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload), // Token'ı oluşturup gönderir
      user: user,
    };
  }

  // Kayıt Olma Fonksiyonu
  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
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
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      console.log('--- DEBUG: Kullanıcı veritabanında bulunamadı! ---');
      return null;
    }

    console.log('--- DEBUG: Kullanıcı bulundu, şifre kontrol ediliyor... ---');
    console.log('Veritabanındaki Hash:', user.password); // Eğer 'undefined' yazıyorsa sorun 1. maddedir.

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('--- DEBUG: Şifre yanlış! ---');
      return null;
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return {
      message: 'Kayıt başarılı',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}

import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint: POST /auth/register
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // Endpoint: POST /auth/login
  @Post('login')
  async login(@Body() body) {
    // Önce kullanıcıyı doğrula
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Email veya şifre hatalı!');
    }
    // Doğruysa token ver
    return this.authService.login(user);
  }
}
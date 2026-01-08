import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module'; // Users modülünü çağırdık
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'GIZLI_KELIME', // Gerçek projede .env dosyasında olur, proje için buraya yazdık.
      signOptions: { expiresIn: '1h' }, // Token 1 saat sonra geçersiz olsun
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
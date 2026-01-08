import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity'; // Ana entity klasörümüzden

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Veritabanı tablosunu bağladık
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // DİKKAT: Bunu eklemezsek Auth modülü burayı kullanamaz!
})
export class UsersModule {}
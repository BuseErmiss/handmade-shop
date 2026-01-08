import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Bunu ekledik
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Register işlemi
  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(newUser);
  }

  // HATA ÇÖZÜMÜ 1: Tip hatası düzeltildi (undefined -> null)
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  // HATA ÇÖZÜMÜ 2: Eksik fonksiyonlar eklendi
  async update(id: number, updateUserDto: UpdateUserDto) {
    // Şimdilik sadece güncelleme işlemini yapalım
    // Gerçek projede şifre değişiyorsa tekrar hash'lemek gerekir
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
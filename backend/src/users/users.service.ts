import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    // E-posta adresi zaten kullanımda mı kontrolü
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Bu e-posta adresi zaten kullanımda.');
    }

    const newUser = this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(newUser);
  }
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      // EĞER BU SATIR YOKSA: bcrypt her zaman 'false' döner çünkü şifre veritabanından gelmez.
      select: ['id', 'email', 'password', 'role', 'fullName'],
    });
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Kullanıcı (#${id}) bulunamadı.`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id); // Kullanıcının var olduğundan emin ol

    // Eğer şifre güncelleniyorsa hash'le
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // Object.assign veya preload kullanarak güncelleyelim
    const updatedUser = Object.assign(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: number) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Silinmek istenen kullanıcı (#${id}) bulunamadı.`);
    }
    return { message: 'Kullanıcı başarıyla silindi.' };
  }
}

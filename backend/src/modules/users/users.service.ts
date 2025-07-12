import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOneByName(name: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { name } });
    return user ?? undefined;
  }

  async findOneById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user ?? undefined;
  }

  async create(name: string): Promise<User> {
    const existingUser = await this.findOneByName(name);
    if (existingUser) {
      throw new ConflictException('User with this name already exists');
    }

    const newUser = this.usersRepository.create({ name });

    return this.usersRepository.save(newUser);
  }
}

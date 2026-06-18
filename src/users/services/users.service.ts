import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../models';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  findOne(name: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { name } });
  }

  createOne({ name, password }: User): Promise<UserEntity> {
    const entity = this.userRepo.create({ name, password });
    return this.userRepo.save(entity);
  }
}

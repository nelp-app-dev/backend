import {Inject, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {User} from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private userRepository: Repository<User>,
  ) {}

  findOne(filter): Promise<User> {
    return this.userRepository.findOne(filter);
  }
}

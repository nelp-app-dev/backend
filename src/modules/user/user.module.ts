import {Module} from '@nestjs/common';
import {DatabaseModule} from '../../database/database.module';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {getRepository} from '../model.repository.factory';

@Module({
  imports: [DatabaseModule],
  providers: [getRepository('User'), UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}

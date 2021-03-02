import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import {Exclude} from 'class-transformer';
import {Role} from '../../utils/decorators/roles.decorator';
import {Base} from '../base.entity';

@Entity()
export class User extends Base {
  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  email: string;

  @Column({
    default: Role.User,
  })
  roles: string;

  @Column({default: true})
  isActive: boolean;
}

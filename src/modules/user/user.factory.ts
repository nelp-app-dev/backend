import {Connection} from 'typeorm/connection/Connection';

export const UserRepository = {
  provide: 'USER',
  useFactory: (connection: Connection) => connection.getRepository('User'),
  inject: ['ORM_CLIENT'],
};

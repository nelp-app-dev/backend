import {Connection} from 'typeorm/connection/Connection';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getRepository = (modelName: string) => ({
  provide: capitalize(modelName) + 'Repository',
  useFactory: (connection: Connection) =>
    connection.getRepository(capitalize(modelName)),
  inject: ['ORM_CLIENT'],
});

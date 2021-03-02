import {createConnection} from 'typeorm';
import * as ORMConfig from '../../ormconfig.json';

let connection;

// return ORM database
export const ORM = {
  getClient: async () => {
    if (connection) return connection;
    connection = createConnection({...ORMConfig, type: 'mssql'});
    return connection;
  },
};

import {getDatabaseName} from '../config/config';
import {getCommand} from './sql/sql';
import {Seeder} from './seeder/seeder';
import {createPool, replacePlaceholders, getMSSQL} from './mssql';
import {getORM} from './orm';

const {NODE_ENV} = process.env;

const dropAndCreateTestDatabase = async () => {
  if (NODE_ENV !== 'test') return;
  const options = {database: getDatabaseName()};
  const pool = await createPool('master');
  const sql = Object.entries(options).reduce(
    replacePlaceholders,
    getCommand('init.database'),
  );
  await pool.request().query(sql);
  await pool.close();
};

(async () => {
  await dropAndCreateTestDatabase();
  clients.mssql = await getMSSQL();
  clients.orm = await getORM();
  await clients.orm.runMigrations();
  await new Seeder(clients.mssql).seed('user');
})();

export const clients: {mssql?: any; orm?: any} = {};

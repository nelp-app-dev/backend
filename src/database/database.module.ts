import {Inject, Module} from '@nestjs/common';
import * as async from 'async';
import {getDatabaseName} from '../config/config';
import {DatabaseProviders} from './database.providers';
import {Seeder} from './seeder/seeder';
const {NODE_ENV} = process.env;

@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {
  constructor(
    @Inject('MSSQL_PROVIDER')
    private readonly mssql,
    @Inject('ORM_PROVIDER')
    private readonly orm,
  ) {
    async.series([
      NODE_ENV === 'test'
        ? async (callback) => {
            await this.dropAndCreateTestDatabase();
            callback(null);
          }
        : Promise.resolve(),
      async (callback) => {
        await this.runMigrationAndSeed();
        callback(null);
      },
    ]);
  }

  async dropAndCreateTestDatabase() {
    if (NODE_ENV !== 'test') return;
    const master = this.mssql.getClient('master');
    await master.command('init.database', {database: getDatabaseName()});
  }

  async runMigrationAndSeed() {
    await this.orm.runMigrations();
    // await new Seeder(this.mssql.getClient()).seed('user');
  }

  // (async () => {
  //   await dropAndCreateTestDatabase();
  //   clients.mssql = await getMSSQL();
  //   clients.orm = await getORM();
  //   await clients.orm.runMigrations();
  //   await new Seeder(clients.mssql).seed('user');
  // })();
}

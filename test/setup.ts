// import {createConnection} from 'typeorm';
// import * as ORMConfig from '../ormconfig.json';
// import {getDbClient} from '../src/database/database.client';
// import {getCommand} from '../src/database/sql/sql';
// import {MSSQLConfig} from '../src/config/config';

// const masterDb = getDbClient('master');
// const testDb = getDbClient('test');

// export default async () => {
//   // init test database
//   await masterDb.dropAndCreateDatabase('test');

//   // run migrations
//   const connection = await createConnection({
//     ...ORMConfig,
//     type: 'mssql',
//   });

//   await connection.runMigrations();
//   await connection.close();

//   // seed test database
//   await testDb.seeder.seed('user');

//   // close databases contections
//   await Promise.all([masterDb.close(), testDb.close()]);
// };

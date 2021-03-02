import {MSSQL} from './mssql';
import {ORM} from './orm';

const MSSQL_PROVIDER = {
  provide: 'MSSQL_PROVIDER',
  useValue: MSSQL,
};

const ORM_PROVIDER = {
  provide: 'ORM_PROVIDER',
  useFactory: async () => await ORM.getClient(),
};

export const DatabaseProviders = [MSSQL_PROVIDER, ORM_PROVIDER];

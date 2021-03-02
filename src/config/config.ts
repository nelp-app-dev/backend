import * as dotenv from 'dotenv';
import * as dotenvParseVariables from 'dotenv-parse-variables';
import * as fs from 'fs';

const rawEnv = dotenv.config({});
if (rawEnv.error) throw rawEnv.error;
const env = dotenvParseVariables(rawEnv.parsed);
const {NODE_ENV} = process.env;

export const AuthConfig = {
  jwtSecret: env.JWT_SECRET,
  sessionSecret: env.SESSION_SECRET,
};

export const getDatabaseName = (dbType = '') =>
  dbType === 'master' ? 'master' : env.MSSQL_DATABASE + '_' + NODE_ENV;

export const MSSQLConfig = {
  host: env.MSSQL_HOST,
  port: env.MSSQL_PORT,
  user: env.MSSQL_USER,
  password: env.MSSQL_PASSWORD,
  database: getDatabaseName(),
};

export const MiscConfig = {redisPort: env.REDIS_PORT};

export const JwtModuleOptions = {
  secretOrPrivateKey: AuthConfig.jwtSecret,
  signOptions: {
    expiresIn: '60s',
  },
};

// write orm config json
fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(
    {
      type: 'mssql',
      host: MSSQLConfig.host,
      port: MSSQLConfig.port,
      username: MSSQLConfig.user,
      password: MSSQLConfig.password,
      database: MSSQLConfig.database,
      migrationsTableName: 'migration',
      entities: ['dist/**/*.entity.js', 'dist/**/!(base).entity.js'],
      migrations: ['dist/**/migration/*.js'],
      cli: {
        migrationsDir: 'src/migration',
      },
    },
    null,
    2,
  ),
);

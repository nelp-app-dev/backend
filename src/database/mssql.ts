import * as mssql from 'mssql';
import * as empty from 'is-empty';
import * as moment from 'moment';
import {getDatabaseName, MSSQLConfig} from '../config/config';
import {getCommand, getQuery} from './sql/sql';

const {NODE_ENV} = process.env;
const config = {
  user: MSSQLConfig.user,
  password: MSSQLConfig.password,
  server: MSSQLConfig.host,
  database: MSSQLConfig.database,
  options: {encrypt: false, enableArithAbort: true},
};

export const replacePlaceholders = (
  acc,
  [key, value = defaultOptions[key]],
) => {
  if (empty(value) && value !== 0) return acc;

  if (key === 'fields' || key === 'orderBy') {
    value = Array.isArray(value) ? value.join(',') : value;
  } else if (key === 'value') {
    value =
      'WHERE ' +
      Object.keys(value)
        .map((valueKey) => `[${valueKey}] = @${valueKey}`)
        .join(' and ');
  }

  return acc
    .replace(new RegExp(`--optional__${key}`, 'g'), value)
    .replace(new RegExp(`required__${key}`, 'g'), value);
};

const {NVarChar, Int, Float, Bit, DateTime} = mssql;

const DB_TYPES = ['development', 'test', 'production', 'master'];

const isInt = (n) => {
  return n % 1 === 0;
};

const getDataType = (value) => {
  const varType = typeof value;
  if (varType === 'boolean') return Bit;
  else if (varType === 'number') return isInt(value) ? Int : Float;
  else if (varType === 'string') return NVarChar;
  else if (moment(value).isValid()) return DateTime;
  else return NVarChar;
};

const defaultOptions = {
  limit: 1000,
  index: 0,
  fields: '*',
  value: {},
  orderBy: ['createdBy'],
};

export const clients = {};

const createClient = (dbType) => {
  // validate database type.
  if (DB_TYPES.indexOf(dbType) === -1)
    throw new Error(
      'Must specify [database]. Choose between "development", "test", "production" or "master"',
    );

  // return database if it exists already
  if (clients[dbType]) return clients[dbType];

  const database = getDatabaseName(dbType);
  let transaction: mssql.Transaction;
  let pool: mssql.ConnectionPool;
  const statements: mssql.PreparedStatement[] = [];

  const connect = async (): Promise<void> => {
    pool = new mssql.ConnectionPool({...config, database});
    await pool.connect();
  };

  const begin = (): Promise<mssql.Transaction> => {
    if (transaction) return;
    transaction = new mssql.Transaction(pool);
    return transaction.begin();
  };

  // const getTransaction = async () => {
  //   const transaction = (await getConnection()).transaction();
  //   await new Promise((resolve) => transaction.begin(resolve));
  //   return transaction;
  // };

  const createStatement = async (
    sql,
    options,
  ): Promise<mssql.PreparedStatement> => {
    // create statement
    const statement = new mssql.PreparedStatement(pool);

    // set input parameters from value
    Object.entries(options.value || {}).forEach(([key, value]) => {
      statement.input(key, getDataType(value));
    });

    // prepare sql by replacing placeholders
    sql = Object.entries(options)
      .reduce(replacePlaceholders, sql)
      .replace(
        new RegExp(`required__offset`, 'g'),
        options.index * options.limit,
      );

    // prepare statement with sql then return
    await statement.prepare(sql);
    statements.push(statement);
    return statement;
  };

  const unprepareStatement = (
    statement: mssql.PreparedStatement,
  ): Promise<void> => {
    if (typeof statement === 'undefined') return;
    if (statement.prepared) return statement.unprepare();
  };

  const commit = (): Promise<void> => {
    return transaction.commit();
  };

  const rollback = async (): Promise<void> => {
    for (const statement of statements) {
      await unprepareStatement(statement);
    }
    // if (typeof transaction === 'undefined') return;
    // await transaction.rollback();
    // transaction = null;
  };

  const disconnect = async (): Promise<void> => {
    if (!pool) return;
    if (pool.connected) return await pool.close();
    pool = null;
  };

  // const executeQuery = async (
  //   table,
  //   {limit = 10, index = 0, fields = ['*'], where = {}, orderBy = []},
  // ) => {
  //   const cnx = await getConnection(database);
  //   let query = getQuery('find');
  //   query = query
  //     .replace('@table_name', table)
  //     .replace('@field', fields.join(','))
  //     .replace('-- @limit', `TOP ${limit}`);

  //   console.log(query);
  //   const results = (await cnx.request()).query(query);
  //   return results;
  // };

  const execute = async (sql, options) => {
    let results = [];
    try {
      await connect();
      // await begin();
      const statement = await createStatement(sql, options);
      results = await statement.execute();
      await unprepareStatement(statement);
      // await commit();
    } catch (error) {
      console.log(error);
      await rollback();
    }

    await disconnect();
    return results;
  };

  const query = async (name, options) => {
    if (name === 'findOne') {
      options.limit = 1;
      options.index = 0;
      name = 'find';
    }

    return execute(getQuery(name), options);
  };

  const command = async (name, options) => {
    return execute(getCommand(name), options);
  };

  clients[database] = {
    type: dbType,
    name: database,
    query,
    command,
  };

  return clients[database];
};

export const MSSQL = {
  getClient: (dbType = '') => {
    return createClient(dbType || NODE_ENV);
  },
};

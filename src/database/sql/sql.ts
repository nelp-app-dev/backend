import * as fse from 'fs-extra';
import {join} from 'path';

const read = (type) => {
  const filePath = join(process.cwd(), 'src', 'database', 'sql', type);
  const files = fse.readdirSync(filePath);
  const sqlFiles = files.filter((f: string) => f.endsWith('.sql'));
  const sql = {};
  for (let i = 0; i < sqlFiles.length; i++) {
    const query = fse.readFileSync(join(filePath, sqlFiles[i]), {
      encoding: 'UTF-8',
    });
    sql[sqlFiles[i].replace('.sql', '')] = query;
  }

  return sql;
};

const queries = read('queries');
const commands = read('commands');

const get = (type, name) => {
  let sql;
  if (type === 'query') sql = queries[name];
  else if (type === 'command') sql = commands[name];
  if (!sql) throw new Error(`SQL file [${name}] does not exist`);
  return sql;
};

export const getQuery = (name) => get('query', name);
export const getCommand = (name) => get('command', name);

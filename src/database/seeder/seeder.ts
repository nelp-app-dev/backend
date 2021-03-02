import {resolve, join} from 'path';

const isInt = (n) => {
  return n % 1 === 0;
};

const parse = (_value) => {
  const _type = typeof _value;
  let value = _value;

  if (_type === 'boolean') {
    value = value === true ? 1 : 0;
  } else if (!isNaN(_value) && _type !== 'string') {
    if (isInt(parseInt(_value))) {
      value = parseInt(_value);
    } else {
      value = parseFloat(_value);
    }
  } else {
    value = `'${value}'`;
  }

  return value;
};

const dataPath = resolve(process.cwd(), 'src', 'config', 'data');

export class Seeder {
  private readonly db: any;
  private model: string;
  private dataFilepath: string;

  constructor(db) {
    this.db = db;
  }

  async seed(model): Promise<void> {
    this.model = model;
    const filename = `${this.model}.${this.db.type}.json`;
    this.dataFilepath = join(dataPath, this.model, filename);
    this.create();
  }

  async create() {
    const collection = await import(this.dataFilepath);
    const table = this.model;

    return Promise.all(
      collection.map(async (item) => {
        try {
          const fields = Object.keys(item);
          this.db.query('findOne', {table, fields, value: item});
          this.db.command('create', {table, fields, value: item});

          // const fields = Object.keys(item);
          // const dbItem = await this.db.query('findOne', {
          //   table: this.model,
          //   limit: 10,
          //   index: 0,
          //   fields,
          //   where: {
          //     ...item,
          //   },
          // });

          // if (Object.keys(dbItem).length) {
          //   return Promise.resolve(null);
          // }

          // return this.db.command('create', {table: this.model, item});
        } catch (error) {
          Promise.reject(error);
        }
      }),
    );
  }
}

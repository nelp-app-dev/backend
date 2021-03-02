import {Test, TestingModule} from '@nestjs/testing';
import {DatabaseModule} from './database.module';
import {INestApplication} from '@nestjs/common';
jest.useFakeTimers();

describe('database.clients', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('describe', () => {
    it('it', () => {
      expect(200).toStrictEqual(200);
    });
  });
});

// import {clients} from './database.clients';

// describe('database.client', () => {
//   it('expect db.find to return prepared query', async () => {
//     const results = await clients.mssql.query('find', {
//       table: 'user',
//       limit: 10,
//       fields: ['id', 'username'],
//     });

//     expect(results).toBeTruthy();
//   });
// });

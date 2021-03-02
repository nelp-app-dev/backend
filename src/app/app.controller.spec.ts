import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from './app.module';
import * as request from 'supertest';
import {INestApplication} from '@nestjs/common';
import {User} from '../modules/user/user.entity';

describe('AppController', () => {
  let app: INestApplication, firstUser: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('check if healthy', () => {
    it('should work and return {"isHealthy": true}', async () => {
      await request(app.getHttpServer())
        .get('/is-healthy')
        .expect(200)
        .then((req) => expect(req.body).toStrictEqual({isHealthy: true}));
    });
  });

  describe('failed login then failed "private" page access', () => {
    it('login should return status 401', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({username: 'test.nelp.app.dev@gmail.com', password: '3711'})
        .expect(401);
    });

    it('"private" page should return 401', async () => {
      await request(app.getHttpServer())
        .get('/private')
        .auth('bad_access_token', {type: 'bearer'})
        .expect(401)
        .then((req) => expect(req.body).toBeTruthy());
    });
  });

  describe('successful login then successful "private" page access', () => {
    let accessToken;
    it('login should return status 201', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({username: 'test.nelp.app.dev@gmail.com', password: '3718'})
        .expect(201)
        .then(({body}) => {
          expect(body.accessToken).toBeTruthy();
          accessToken = body.accessToken;
        });
    });

    it('"private" page should return status 200', async () => {
      await request(app.getHttpServer())
        .get('/private')
        .auth(accessToken, {type: 'bearer'})
        .expect(200)
        .then((req) => expect(req.body).toBeTruthy());
    });

    it('changes accessToken to a bad one, then "private" page should return status 401', async () => {
      accessToken = accessToken + 'toto';
      await request(app.getHttpServer())
        .get('/private')
        .auth(accessToken, {type: 'bearer'})
        .expect(401);
    });
  });
});

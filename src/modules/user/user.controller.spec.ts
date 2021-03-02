import {INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {UserModule} from './user.module';
import {AuthModule} from '../auth/auth.module';
import * as request from 'supertest';

describe('UserController', () => {
  let app: INestApplication, accessToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, AuthModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('get access token', () => {
    it('should not return access token (401)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({username: 'nelp.app.dev@gmail.com', password: '3711'})
        .expect(401);
    });

    it('should return access token (201)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({username: 'nelp.app.dev@gmail.com', password: '3718'})
        .expect(201)
        .then((res) => {
          expect(res.body.accessToken).toBeTruthy();
          accessToken = res.body.accessToken;
        });
    });
  });

  describe('access user pages', () => {
    it('user "free" page should be public at all times', () => {
      return request(app.getHttpServer())
        .get('/user')
        .send({accessToken: 'wont-work'})
        .expect(401);
    });

    it('user "profile" page should not be accessible without a valid access token', () => {
      return request(app.getHttpServer())
        .get('/user')
        .send({accessToken: 'wont-work'})
        .expect(401);
    });

    it('user "profile" page should be accessible with a valid access token', () => {
      return request(app.getHttpServer())
        .get('/user')
        .send({accessToken})
        .expect(200);
    });
  });
});

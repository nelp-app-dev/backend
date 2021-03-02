import {INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from './auth.controller';
import {AuthModule} from './auth.module';
import * as request from 'supertest';

describe('AuthController', () => {
  let controller: AuthController, app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should not return user (401)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({username: 'nicolas', password: '3711'})
        .expect(401);
    });

    it('should return user (201)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({username: 'nicolas', password: '3718'})
        .expect(201);
    });
  });
});

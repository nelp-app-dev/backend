import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {sessionMiddleware} from './middlewares/session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: true,
  });
  app.use(sessionMiddleware);
  await app.listen(3000);
}

bootstrap();

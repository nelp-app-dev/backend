import {Logger, Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {AppController} from './app.controller';
import {AppGuard} from '../utils/guards/app.guard';
import {AuthModule} from '../modules/auth/auth.module';
import {UserModule} from '../modules/user/user.module';

const logger = new Logger('AppModule');
logger.log(`
            _       
 _ __   ___| |_ __  
| '_ \\ / _ \\ | '_ \\ 
| | | |  __/ | |_) |
|_| |_|\\___|_| .__/ 
             |_|  
  version: 1.0.0
`);

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
  ],
  imports: [AuthModule, UserModule],
  controllers: [AppController],
})
export class AppModule {}

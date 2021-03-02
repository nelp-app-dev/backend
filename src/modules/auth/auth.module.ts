import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from '../user/user.module';
import {JwtModule} from '@nestjs/jwt';
import {JwtModuleOptions} from '../../config/config';
import {JwtPassport} from '../../utils/guards/app.guard';
import {PassportModule} from '@nestjs/passport';

@Module({
  providers: [JwtPassport, AuthService],
  imports: [PassportModule, JwtModule.register(JwtModuleOptions), UserModule],
  controllers: [AuthController],
})
export class AuthModule {}

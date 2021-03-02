import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {Role, Roles} from '../utils/decorators/roles.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AppController {
  @Get('is-healthy')
  getHealth(): any {
    return {isHealthy: true};
  }

  @Roles(Role.User)
  @Get('private')
  getPrivateIndex(): any {
    return {success: true};
  }
}

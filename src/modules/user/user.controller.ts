import {Controller, Request, Post, UseGuards, Get} from '@nestjs/common';
import {UserService} from './user.service';

import {Role, Roles} from '../../utils/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(Role.User)
  @Get()
  async profile(@Request() req) {
    return this.userService.findOne(req.body);
  }

  @Get()
  async free() {
    return 'this.userService.findOne(req.body)';
  }
}

import {Controller, Request, Post, UnauthorizedException} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthResponseDto} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req): Promise<AuthResponseDto> {
    const user = await this.authService.validateAuth(req.body);
    if (user) return this.authService.login(user);
    throw new UnauthorizedException();
  }
}

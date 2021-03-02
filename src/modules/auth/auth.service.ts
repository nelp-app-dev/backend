import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {User} from '../user/user.entity';
import {UserService} from '../user/user.service';
import {AuthDto, AuthResponseDto} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateAuth(auth: AuthDto): Promise<User> {
    const user = await this.userService.findOne(auth);
    if (user && user.password === auth.password) return user;
    return null;
  }

  login({id, username, roles}: User): AuthResponseDto {
    const payload = {username, sub: id, roles};
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

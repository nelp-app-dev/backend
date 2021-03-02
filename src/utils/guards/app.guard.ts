import {ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {AuthGuard, PassportStrategy} from '@nestjs/passport';
import {Role, ROLES_KEY} from '../decorators/roles.decorator';
import {ExtractJwt, Strategy as JwtStrategy} from 'passport-jwt';
import {AuthConfig} from '../../config/config';

@Injectable()
export class JwtPassport extends PassportStrategy(JwtStrategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AuthConfig.jwtSecret,
    });
  }

  async validate(payload): Promise<any> {
    return {id: payload.sub, username: payload.username, roles: payload.roles};
  }
}

@Injectable()
export class AppGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get context roles
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // disallow if no roles are specified
    if (!roles || roles.length === 0) return true;

    // disallow if passport validation fails
    const isAllowed = (await super.canActivate(context)) as boolean;
    if (!isAllowed) return false;

    // allow if roles included user.roles
    const {user} = context.switchToHttp().getRequest();
    const hasRole = roles.some((role) => user?.roles?.includes(role));
    if (hasRole) return true;

    return false;
  }
}

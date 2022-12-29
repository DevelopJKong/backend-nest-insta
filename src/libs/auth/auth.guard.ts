import { RoleData } from '@prisma/client';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './role.decorator';
import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { UsersService } from './../../users/users.service';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>('roles', context.getHandler());

    // ! @RoleData()가 없는 경우
    if (!roles) return true;

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;

    // ! 토큰이 없는 경우
    if (!token) return false;

    const decoded = this.jwtService.verify(token.toString());
    const isDecodedCheck = typeof decoded !== 'object' || !Object.prototype.hasOwnProperty.call(decoded, 'id');

    // ! 토큰이 유효하지 않은 경우
    if (isDecodedCheck) return false;

    const { user } = await this.usersService.findById({ id: decoded['id'] });

    // ! 유저가 없는 경우
    if (!user) return false;

    gqlContext['user'] = user;

    // ! "USER"인 경우
    if (roles.includes(RoleData.USER)) return true;

    // * "USER"가 아닌 경우
    return roles.includes(user.role);
  }
}

<<<<<<< HEAD
import { Role } from '@prisma/client';
=======
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272
import { GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './role.decorator';
import { ExecutionContext } from '@nestjs/common';
import { UsersService } from './../../users/users.service';
import { Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../jwt/jwt.service';
<<<<<<< HEAD
=======
import { ROLE_KEY } from 'src/common/common.constants';
import { Role } from '@prisma/client';
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
<<<<<<< HEAD
    const roles = this.reflector.get<AllowedRoles>('roles', context.getHandler());
=======
    const roles = this.reflector.get<AllowedRoles>(ROLE_KEY, context.getHandler());
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272

    // ! @RoleData()가 없는 경우
    if (!roles) return true;

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;

    // ! 토큰이 없는 경우
    if (!token) return false;

    const decoded = this.jwtService.verify(token.toString());
    const isDecodedCheck =
      typeof decoded !== 'object' || !Object.prototype.hasOwnProperty.call(decoded, 'id');

    // ! 토큰이 유효하지 않은 경우
    if (isDecodedCheck) return false;

<<<<<<< HEAD
    const { user } = await this.usersService.findById(decoded['id']);
=======
    const { user } = await this.usersService.findById({ id: decoded['id'] });
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272

    // ! 유저가 없는 경우
    if (!user) return false;

    gqlContext['user'] = user;

    // ! "USER"인 경우
    if (roles.includes(Role.USER)) return true;

    // * "USER"가 아닌 경우
    return roles.includes(user.role);
  }
}

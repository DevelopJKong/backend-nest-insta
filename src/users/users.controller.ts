import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/join')
  async join(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data);
  }
}

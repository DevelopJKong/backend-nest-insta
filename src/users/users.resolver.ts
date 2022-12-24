import { GetUserInput } from './dtos/get-user.dto';
import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dtos/create-user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async getUser(@Args('input') id: GetUserInput) {
    return this.usersService.getUser(id);
  }

  @Mutation(() => User)
  async createUser(@Args('input') createAccountInput: CreateUserInput) {
    return this.usersService.createUser(createAccountInput);
  }
}

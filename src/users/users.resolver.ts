import { GetUserInput, GetUserOutput } from "./dtos/get-user.dto";
import { Resolver, Args, Query, Mutation } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";

@Resolver((_of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {
  }

  @Query((_returns) => GetUserOutput)
  async getUser(@Args("input") id: GetUserInput): Promise<GetUserOutput> {
    return this.usersService.getUser(id);
  }

  @Mutation((_returns) => CreateUserOutput)
  async createUser(@Args("input") createAccountInput: CreateUserInput): Promise<CreateUserOutput> {
    return this.usersService.createUser(createAccountInput);
  }
}

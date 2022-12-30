import { FollowUserInput, FollowUserOutput } from './dtos/follow-user.dto';
import { RoleData } from '@prisma/client';
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto';
import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Role } from '../libs/auth/role.decorator';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';
@Resolver((_of?: void) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(_returns => CreateUserOutput)
  async createUser(@Args('input') createAccountInput: CreateUserInput): Promise<CreateUserOutput> {
    return this.usersService.createUser(createAccountInput);
  }

  @Mutation(_returns => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query(_returns => GetUserOutput)
  @Role([RoleData.USER])
  async getUser(@Args('input') { id }: GetUserInput): Promise<GetUserOutput> {
    return this.usersService.findById({ id });
  }

  @Mutation(_returns => EditProfileOutput)
  @Role([RoleData.USER])
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation(_returns => FollowUserOutput)
  @Role([RoleData.USER])
  async followUser(
    @AuthUser() authUser: User,
    @Args('input') followUserInput: FollowUserInput,
  ): Promise<FollowUserOutput> {
    return this.usersService.followUser(authUser.id, followUserInput);
  }
}

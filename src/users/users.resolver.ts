import { SearchUsersInput, SearchUsersOutput } from './dtos/search-users.dto';
import { SeeFollowersOutput, SeeFollowersInput } from './dtos/see-followers.dto';
import { FollowUserInput, FollowUserOutput } from './dtos/follow-user.dto';
import { RoleData } from '@prisma/client';
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto';
import { Resolver, Args, Query, Mutation, ResolveField, Int, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Role } from '../libs/auth/role.decorator';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';
import { UnFollowUserInput, UnFollowUserOutput } from './dtos/un-follow-user.dto';
import { SeeFollowingOutput, SeeFollowingInput } from './dtos/see-following.dto';
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
  async getUser(@AuthUser() authUser: User, @Args('input') { id }: GetUserInput): Promise<GetUserOutput> {
    return this.usersService.findById(authUser.id, { id });
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

  @Mutation(_returns => UnFollowUserOutput)
  @Role([RoleData.USER])
  async unFollowUser(@AuthUser() authUser: User, @Args('input') unFollowUserInput: UnFollowUserInput) {
    return this.usersService.unFollowUser(authUser.id, unFollowUserInput);
  }

  @Query(_returns => SeeFollowersOutput)
  @Role([RoleData.USER])
  async seeFollowers(@AuthUser() authUser: User, @Args('input') seeFollowersInput: SeeFollowersInput) {
    return this.usersService.seeFollowers(authUser.id, seeFollowersInput);
  }

  @Query(_returns => SeeFollowingOutput)
  @Role([RoleData.USER])
  async seeFollowing(@AuthUser() authUser: User, @Args('input') seeFollowingInput: SeeFollowingInput) {
    return this.usersService.seeFollowing(authUser.id, seeFollowingInput);
  }

  @Query(_returns => SearchUsersOutput)
  @Role([RoleData.USER])
  async searchUsers(@AuthUser() authUser: User, @Args('input') searchUserInput: SearchUsersInput) {
    return this.usersService.searchUsers(authUser.id, searchUserInput);
  }

  @ResolveField(_type => Int)
  totalFollowing(@Parent() user: User): Promise<number> {
    return this.usersService.totalFollowing(user.id);
  }

  @ResolveField(_type => Int)
  totalFollowers(@Parent() user: User): Promise<number> {
    return this.usersService.totalFollowers(user.id);
  }
  @ResolveField(_type => Boolean)
  isMe(@AuthUser() authUser: User, @Parent() user: User): boolean {
    return this.usersService.isMe(authUser, user.id);
  }

  @ResolveField(_type => Boolean)
  isFollowing(@AuthUser() authUser: User, @Parent() user: User): Promise<boolean> | boolean {
    return this.usersService.isFollowing(authUser, user.id);
  }
}

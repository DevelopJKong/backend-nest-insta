import { Photo } from './../photos/entities/photo.entity';
import { SearchUsersInput, SearchUsersOutput } from './dto/search-users.dto';
import { SeeFollowersOutput, SeeFollowersInput } from './dto/see-followers.dto';
import { FollowUserInput, FollowUserOutput } from './dto/follow-user.dto';
import { RoleData } from '@prisma/client';
import { GetUserInput, GetUserOutput } from './dto/get-user.dto';
import { Resolver, Args, Query, Mutation, ResolveField, Int, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { Role } from '../libs/auth/role.decorator';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';
import { UnFollowUserInput, UnFollowUserOutput } from './dto/un-follow-user.dto';
import { SeeFollowingOutput, SeeFollowingInput } from './dto/see-following.dto';
import { CoreOutput } from '../common/dto/output.dto';
import { MeOutput } from './dto/me.dto';
import { SeeProfileInput, SeeProfileOutput } from './dto/see-profile.dto';
@Resolver((_of?: void) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(_returns => CoreOutput)
  hi() {
    return {
      ok: true,
      message: 'Query Check Success',
    };
  }

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
  async getUser(@AuthUser() authUser: User, @Args('input') getUserInput: GetUserInput): Promise<GetUserOutput> {
    return this.usersService.findById(authUser.id, getUserInput);
  }

  @Query(_returns => SeeProfileOutput)
  @Role([RoleData.USER])
  async seeProfile(
    @AuthUser() authUser: User,
    @Args('input') seeProfileInput: SeeProfileInput,
  ): Promise<SeeProfileOutput> {
    return this.usersService.seeProfile(authUser.id, seeProfileInput);
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

  @Query(_returns => MeOutput)
  @Role([RoleData.USER])
  async me(@AuthUser() authUser: User): Promise<MeOutput> {
    return this.usersService.me(authUser.id);
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
  isFollowing(@AuthUser() authUser: User, @Parent() user: User): Promise<boolean> {
    return this.usersService.isFollowing(authUser, user.id);
  }

  @ResolveField(_type => [Photo])
  async photos(@Parent() user: User): Promise<Photo[]> {
    return this.usersService.photos(user.id);
  }
}

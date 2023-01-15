import { ResolveFieldUserPhotosOutput } from './dtos/resolve-field-user-photos.dto';
import { Photo } from './../photos/entities/photo.entity';
import { SearchUsersInput, SearchUsersOutput } from './dtos/search-users.dto';
import { SeeFollowersOutput, SeeFollowersInput } from './dtos/see-followers.dto';
import { FollowUserInput, FollowUserOutput } from './dtos/follow-user.dto';
import { RoleData } from '@prisma/client';
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto';
import { Resolver, Args, Query, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Role } from '../libs/auth/role.decorator';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';
import { UnFollowUserInput, UnFollowUserOutput } from './dtos/un-follow-user.dto';
import { SeeFollowingOutput, SeeFollowingInput } from './dtos/see-following.dto';
import { ResolveFieldUserTotalFollowingOutput } from './dtos/resolve-field-total-following.dto';
import { ResolveFieldTotalFollowersOutput } from './dtos/resolve-field-total-followers.dto';
import { ResolveFieldIsMeOutput } from './dtos/resolve-field-is-me.dto';
import { ResolveFieldIsFollowingOutput } from './dtos/resolve-field-is-following.dto';
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

  @ResolveField(_type => ResolveFieldUserTotalFollowingOutput)
  totalFollowing(@Parent() user: User): Promise<ResolveFieldUserTotalFollowingOutput> {
    return this.usersService.totalFollowing(user.id);
  }

  @ResolveField(_type => ResolveFieldTotalFollowersOutput)
  totalFollowers(@Parent() user: User): Promise<ResolveFieldTotalFollowersOutput> {
    return this.usersService.totalFollowers(user.id);
  }
  @ResolveField(_type => ResolveFieldIsMeOutput)
  isMe(@AuthUser() authUser: User, @Parent() user: User): ResolveFieldIsMeOutput {
    return this.usersService.isMe(authUser, user.id);
  }

  @ResolveField(_type => ResolveFieldIsFollowingOutput)
  isFollowing(@AuthUser() authUser: User, @Parent() user: User): Promise<ResolveFieldIsFollowingOutput> {
    return this.usersService.isFollowing(authUser, user.id);
  }

  @ResolveField(_type => [Photo])
  async photos(@Parent() user: User): Promise<ResolveFieldUserPhotosOutput> {
    return this.usersService.photos(user.id);
  }
}

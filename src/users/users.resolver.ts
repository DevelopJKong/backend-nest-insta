import { GetUserInput, GetUserOutput } from './dtos/get-user.dto';
import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
<<<<<<< HEAD
import { Role } from '@prisma/client';
import { RoleData } from "../libs/auth/role.decorator";
=======
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272

@Resolver((_of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

<<<<<<< HEAD
=======
  @Query((_returns) => GetUserOutput)
  async getUser(@Args('input') id: GetUserInput): Promise<GetUserOutput> {
    return this.usersService.findById(id);
  }

>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272
  @Mutation((_returns) => CreateUserOutput)
  async createUser(@Args('input') createAccountInput: CreateUserInput): Promise<CreateUserOutput> {
    return this.usersService.createUser(createAccountInput);
  }

  @Mutation((_returns) => LoginOutput)
<<<<<<< HEAD
  async login(@Args() loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }
  

  @Query((_returns) => GetUserOutput)
  @RoleData([Role.USER])
  async getUser(@Args('input') getUserInput: GetUserInput): Promise<GetUserOutput> {
    return this.usersService.findById(getUserInput);
  }

  @Mutation((_returns) => EditProfileOutput)
  @RoleData([Role.USER])
=======
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Mutation((_returns) => EditProfileOutput)
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272
  async editProfile(@Args('input') editProfileInput: EditProfileInput): Promise<EditProfileOutput> {
    return this.usersService.editProfile(editProfileInput);
  }
}

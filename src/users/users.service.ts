import { Photo } from 'src/photos/entities/photo.entity';
import { SeeFollowingOutput, SeeFollowingInput } from './dtos/see-following.dto';
import { SeeFollowersInput, SeeFollowersOutput } from './dtos/see-followers.dto';
import { FollowUserInput, FollowUserOutput } from './dtos/follow-user.dto';
import { BACKEND_URL } from './../common/common.constants';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoggerService } from '../libs/logger/logger.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from '../libs/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import * as fs from 'fs';
import { fileFolder } from 'src/common/common.constants';
import { UnFollowUserInput, UnFollowUserOutput } from './dtos/un-follow-user.dto';
import { User } from './entities/user.entity';
import { SearchUsersInput, SearchUsersOutput } from './dtos/search-users.dto';
import { UploadsService } from '../uploads/uploads.service';
import * as winston from 'winston';
import * as chalk from 'chalk';
import { MeOutput } from './dtos/me.dto';
import { COMMON_ERROR } from '../common/constants/error.constant';
import { USER_SUCCESS } from '../common/constants/success.constant';
import { DEV, PROD } from '../common/common.constants';
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LoggerService,
    private readonly jwtService: JwtService,
    private readonly uploadsService: UploadsService,
  ) {}

  successLogger(service: { name: string }, method: string): winston.Logger {
    const colorName = chalk.yellow(service.name);
    const colorMethod = chalk.cyan(`${this[`${method}`].name}()`);
    const colorSuccess = chalk.green('????????? ?????? ??????');
    return this.log.logger().info(`${colorName} => ${colorMethod} | Success Message ::: ${colorSuccess}`);
  }

  async totalFollowing(id: number): Promise<number> {
    // ! ????????? ???
    const totalFollowing = await this.prisma.user
      .count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      })
      .catch(error => error && 0);
    this.successLogger(UsersService, this.totalFollowing.name);
    return totalFollowing;
  }

  async totalFollowers(id: number): Promise<number> {
    // ! ????????? ???
    const totalFollowers = await this.prisma.user
      .count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      })
      .catch(error => error && 0);
    this.successLogger(UsersService, this.totalFollowers.name);
    return totalFollowers;
  }

  isMe(user: User, id: number): boolean {
    if (!user) {
      return false;
    }
    // ! ??? ???????????? ??????
    this.successLogger(UsersService, this.isMe.name);
    return id === user.id;
  }

  async isFollowing(user: User, id: number): Promise<boolean> {
    if (!user) {
      return false;
    }
    // ! ????????? ?????? ??????
    const isFollowing = await this.prisma.user
      .count({
        where: {
          username: user.username,
          following: {
            some: {
              id,
            },
          },
        },
      })
      .catch(error => error && false);
    this.successLogger(UsersService, this.isFollowing.name);
    return Boolean(isFollowing);
  }
  async photos(id: number): Promise<Photo[]> {
    const photos = await this.prisma.user
      .findUnique({
        where: {
          id,
        },
      })
      .photos();
    this.successLogger(UsersService, this.photos.name);
    return photos as Photo[];
  }

  async me(userId: number): Promise<MeOutput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return {
        ok: true,
        message: USER_SUCCESS.me.text,
        user,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: COMMON_ERROR.extraError.text };
    }
  }

  async findById(userId: number, { id }: GetUserInput): Promise<GetUserOutput> {
    try {
      // ! ???????????????????????? ?????? ??????
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          following: true,
          followers: true,
        },
      });
      const [totalFollowing, totalFollowers, isFollowing, isMe] = await Promise.all([
        this.totalFollowing(id), // ! ????????? ???
        this.totalFollowers(id), // ! ????????? ???
        this.isFollowing(user, userId), // ! ????????? ?????? ??????
        this.isMe(user, userId), // ! ??? ???????????? ??????
      ]);
      // ! ????????? ?????? ??????
      if (!user) {
        return {
          ok: false,
          error: new Error('???????????? ????????? ????????????'),
        };
      }
      // * ????????? ?????? ??????
      return {
        ok: true,
        user,
        message: '?????? ??????',
        totalFollowing,
        totalFollowers,
        isMe,
        isFollowing,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async createUser({ firstName, lastName, email, username, password }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      // ! ?????? ????????????????????? ???????????? ???????????? ??????????????? ??????
      const exists = await this.prisma.user.findFirst({
        where: {
          OR: [
            {
              username,
            },
            // {
            //   email,
            // },
          ],
        },
      });
      if (exists) {
        // ! ?????? ????????? ?????? ????????? ??????
        return {
          ok: false,
          error: new Error('?????? ????????? ?????? ????????? ??????'),
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword,
        },
      });

      // * ?????? ?????? ??????
      return {
        ok: true,
        message: '?????? ?????? ??????',
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      // ! ???????????????????????? ?????? ??????
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      // ! ????????? ?????? ??????
      if (!user) {
        return {
          ok: false,
          error: new Error('????????? ?????? ??????'),
        };
      }

      // ! ???????????? ??????
      const passwordOk = await bcrypt.compare(password, user.password);

      // ! ??????????????? ?????? ??????
      if (!passwordOk) {
        return {
          ok: false,
          error: new Error('??????????????? ?????? ??????'),
        };
      }

      const token = this.jwtService.sign({ id: user.id });
      // * ????????? ??????
      return {
        ok: true,
        message: '????????? ??????',
        token,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async editProfile(
    userId: number,
    { email, password: newPassword, firstName, username, lastName, bio, avatarField }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      let filePath: string;
      let avatarFilePath: string;
      if (avatarField) {
        // ! ?????? ???????????? ?????? ??????
        if (process.env.NODE_ENV === DEV) {
          const { createReadStream, filename } = await avatarField;
          const userFileFolder = join(fileFolder, './user');
          if (!fs.existsSync(userFileFolder)) {
            fs.mkdirSync(userFileFolder);
          }
          const devResult = createReadStream().pipe(createWriteStream(join(userFileFolder, `./${filename}`)));
          filePath = devResult.path as string;
          avatarFilePath = `${BACKEND_URL}` + join('/files', filePath.split(fileFolder)[1]);
        }

        // ! ?????? ???????????? ?????? ??????
        if (process.env.NODE_ENV === PROD) {
          avatarFilePath = await this.uploadsService.uploadFile(avatarField, userId, 'avatar');
        }
      }
      let hashedPassword: string;
      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          email,
          username,
          firstName,
          lastName,
          bio,
          ...(avatarFilePath && { avatar: avatarFilePath }),
          ...(hashedPassword && { password: hashedPassword }),
        },
      });
      if (!updatedUser.id) {
        // ! ????????? ?????? ??????
        return {
          ok: false,
          error: new Error('????????? ?????? ??????'),
        };
      }

      // * ?????? ?????? ??????
      this.log.logger().info(`${this.log.loggerInfo('?????? ?????? ??????')}`);
      return {
        ok: true,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async followUser(userId: number, { username }: FollowUserInput): Promise<FollowUserOutput> {
    try {
      const ok = await this.prisma.user.findUnique({ where: { username } });
      if (!ok) {
        // ! ????????? ?????? ??????
        return {
          ok: false,
          error: new Error('????????? ?????? ??????'),
        };
      }
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          following: {
            connect: {
              username,
            },
          },
        },
      });
      // * ????????? ??????
      return {
        ok: true,
        message: '????????? ??????',
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async unFollowUser(userId: number, { username }: UnFollowUserInput): Promise<UnFollowUserOutput> {
    try {
      const ok = await this.prisma.user.findUnique({ where: { username } });
      if (!ok) {
        // ! ????????? ?????? ??????
        return {
          ok: false,
          error: new Error('???????????? ?????? ????????????.'),
        };
      }

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          following: {
            disconnect: {
              username,
            },
          },
        },
      });

      // * ???????????? ??????
      return {
        ok: true,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
  async seeFollowers(userId: number, { username, page }: SeeFollowersInput): Promise<SeeFollowersOutput> {
    try {
      const ok = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!ok) {
        // ! ????????? ?????? ??????
        return {
          ok: false,
          error: new Error('????????? ?????? ?????? ????????????'),
        };
      }
      const followers = await this.prisma.user.findUnique({ where: { username } }).followers({
        take: 5,
        skip: (page - 1) * 5,
      });

      const totalFollowers = await this.prisma.user.count({
        where: { following: { some: { username } } },
      });
      // * ????????? ?????? ??????
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
        message: '????????? ?????? ??????',
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async seeFollowing(userId: number, { username, lastId }: SeeFollowingInput): Promise<SeeFollowingOutput> {
    try {
      const ok = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!ok) {
        // ! ????????? ?????? ??????
        return {
          ok: false,
          error: new Error('????????? ?????? ?????? ????????????'),
        };
      }
      const following = await this.prisma.user.findUnique({ where: { username } }).following({
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
      // * ????????? ?????? ??????
      this.log.logger().info(`${this.log.loggerInfo('????????? ?????? ??????')}`);
      return {
        ok: true,
        following,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async searchUsers(userId: number, { keyword }: SearchUsersInput): Promise<SearchUsersOutput> {
    try {
      // ! ???????????????????????? ????????? ??????
      const users = await this.prisma.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
      });

      // ! ???????????????????????? ?????? ??????
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          following: true,
          followers: true,
        },
      });

      const [totalFollowing, totalFollowers, isFollowing, isMe] = await Promise.all([
        this.totalFollowing(userId), // ! ????????? ???
        this.totalFollowers(userId), // ! ????????? ???
        this.isFollowing(user, userId), // ! ????????? ?????? ??????
        this.isMe(user, userId), // ! ??? ???????????? ??????
      ]);

      return {
        ok: true,
        users,
        totalFollowing,
        totalFollowers,
        isMe,
        isFollowing,
      };
    } catch (error) {
      // ! extraError
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
}

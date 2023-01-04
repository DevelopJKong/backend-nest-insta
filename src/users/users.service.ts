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

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LoggerService,
    private readonly jwtService: JwtService,
  ) {}

  async totalFollowing(id: number): Promise<number> {
    // ! 팔로잉 수
    this.log.logger().info(`${this.log.loggerInfo('팔로잉 수')}`);
    return this.prisma.user
      .count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      })
      .then(res => res)
      .catch(error => error && 0);
  }

  async totalFollowers(id: number): Promise<number> {
    // ! 팔로워 수
    this.log.logger().info(`${this.log.loggerInfo('팔로워 수')}`);
    return this.prisma.user
      .count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      })
      .then(res => res)
      .catch(error => error && 0);
  }

  isMe(user: User, id: number): boolean {
    if (!user) {
      return false;
    }
    // ! 내 계정인지 확인
    this.log.logger().info(`${this.log.loggerInfo('내 계정인지 확인')}`);
    return id === user.id;
  }

  isFollowing(user: User, id: number): Promise<boolean> | boolean {
    if (!user) {
      return false;
    }
    // ! 팔로잉 여부 확인
    this.log.logger().info(`${this.log.loggerInfo('팔로잉 여부 확인')}`);
    return this.prisma.user
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
      .then(res => Boolean(res))
      .catch(error => error && false);
  }

  async findById(userId: number, { id }: GetUserInput): Promise<GetUserOutput> {
    try {
      // ! 데이터베이스에서 유저 찾기
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          following: true,
          followers: true,
        },
      });
      const totalFollowing = await this.totalFollowing(id);
      const totalFollowers = await this.totalFollowers(id);
      const isMe = this.isMe(user, userId);
      const isFollowing = await this.isFollowing(user, userId);
      // ! 유저가 없을 경우
      if (!user) {
        this.log.logger().error(`${this.log.loggerInfo('존재하는 유저가 없습니다')}`);
        return {
          ok: false,
          error: '존재하는 유저가 없습니다',
        };
      }
      // * 유저가 있을 경우
      this.log.logger().info(`${this.log.loggerInfo('유저 찾기')}`);
      return {
        ok: true,
        user,
        totalFollowing,
        totalFollowers,
        isMe,
        isFollowing,
      };
    } catch (error) {
      // ! extraError
      const { message, name, stack } = error;
      this.log.logger().error(`${this.log.loggerInfo('extraError', message, name, stack)}`);
      return {
        ok: false,
        error: 'User not found',
      };
    }
  }

  async createUser({ firstName, lastName, email, username, password }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      // ! 이미 데이터베이스에 닉네임과 이메일이 존재하는지 확인
      const exists = await this.prisma.user.findFirst({
        where: {
          OR: [
            {
              username,
            },
            {
              email,
            },
          ],
        },
      });
      if (exists) {
        // ! 유저 네임이 이미 존재할 경우
        this.log.logger().error(`${this.log.loggerInfo('유저 네임이 이미 존재할 경우')}`);
        return {
          ok: false,
          error: 'existError',
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

      // * 유저 생성 완료
      this.log.logger().info(`${this.log.loggerInfo('유저 생성 완료')}`);
      return {
        ok: true,
      };
    } catch (error) {
      // ! extraError
      const { message, name, stack } = error;
      this.log.logger().error(`${this.log.loggerInfo('extraError', message, name, stack)}`);
      return {
        ok: false,
        error: 'Could not create account',
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      // ! 데이터베이스에서 유저 찾기
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      // ! 유저가 없을 경우
      if (!user) {
        this.log.logger().error(`${this.log.loggerInfo('유저가 없을 경우')}`);
        return {
          ok: false,
          error: 'User not found',
        };
      }

      // ! 비밀번호 확인
      const passwordOk = await bcrypt.compare(password, user.password);

      // ! 비밀번호가 틀릴 경우
      if (!passwordOk) {
        this.log.logger().error(`${this.log.loggerInfo('비밀번호가 틀릴 경우')}`);
        return {
          ok: false,
          error: 'Wrong password',
        };
      }

      const token = this.jwtService.sign({ id: user.id });
      // * 로그인 성공
      this.log.logger().info(`${this.log.loggerInfo('로그인 성공')}`);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      // ! extraError
      const { message, name, stack } = error;
      this.log.logger().error(`${this.log.loggerInfo('extraError', message, name, stack)}`);
      return {
        ok: false,
        error: 'existError',
      };
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
        const { createReadStream, filename } = await avatarField;
        const userFileFolder = join(fileFolder, './user');

        // ! 개발 환경에서 파일 저장
        if (process.env.NODE_ENV === 'dev') {
          if (!fs.existsSync(userFileFolder)) {
            fs.mkdirSync(userFileFolder);
          }
          const devResult = createReadStream().pipe(createWriteStream(join(userFileFolder, `./${filename}`)));
          filePath = devResult.path as string;
          avatarFilePath = `${BACKEND_URL}` + join('/files', filePath.split(fileFolder)[1]);
        }

        // ! 배포 환경에서 파일 저장
        if (process.env.NODE_ENV === 'prod') {
          const prodResult = createReadStream().pipe(createWriteStream(join(userFileFolder, `./${filename}`)));
          filePath = prodResult.path as string;
          avatarFilePath = `${BACKEND_URL}` + join('/files', filePath.split(fileFolder)[1]);
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
        // ! 유저가 없을 경우
        this.log.logger().error(`${this.log.loggerInfo('유저가 없을 경우')}`);
        return {
          ok: false,
          error: 'updateError',
        };
      }

      // * 회원 수정 완료
      this.log.logger().info(`${this.log.loggerInfo('회원 수정 완료')}`);
      return {
        ok: true,
      };
    } catch (error) {
      // ! extraError
      const { message, name, stack } = error;
      this.log.logger().error(`${this.log.loggerInfo('extraError', message, name, stack)}`);
      return {
        ok: false,
        error: 'existError',
      };
    }
  }

  async followUser(userId: number, { username }: FollowUserInput): Promise<FollowUserOutput> {
    try {
      const ok = await this.prisma.user.findUnique({ where: { username } });
      if (!ok) {
        // ! 유저가 없을 경우
        this.log.logger().error(`${this.log.loggerInfo('유저가 없을 경우')}`);
        return {
          ok: false,
          error: '유저가 존재하지 않습니다',
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
      // * 팔로우 완료
      this.log.logger().info(`${this.log.loggerInfo('팔로우 완료')}`);
      return {
        ok: true,
      };
    } catch (error) {
      // ! extraError
      const { message, name, stack } = error;
      this.log.logger().error(`${this.log.loggerInfo('extraError', message, name, stack)}`);
      return {
        ok: false,
        error: 'existError',
      };
    }
  }

  async unFollowUser(userId: number, { username }: UnFollowUserInput): Promise<UnFollowUserOutput> {
    try {
      const ok = await this.prisma.user.findUnique({ where: { username } });
      if (!ok) {
        // ! 유저가 없을 경우
        this.log.logger().error(`${this.log.loggerInfo('유저가 없을 경우')}`);
        return {
          ok: false,
          error: '언팔로우 할수 없습니다.',
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

      // * 언팔로우 완료
      this.log.logger().info(`${this.log.loggerInfo('언팔로우 완료')}`);
      return {
        ok: true,
      };
    } catch (error) {
      // ! extraError
      const { message, name, stack } = error;
      this.log.logger().error(`${this.log.loggerInfo('extraError', message, name, stack)}`);
      return {
        ok: false,
        error: 'existError',
      };
    }
  }
  async seeFollowers(userId: number, { username, page }: SeeFollowersInput): Promise<SeeFollowersOutput> {
    try {
      const ok = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
      if (!ok) {
        // ! 유저가 없을 경우
        this.log.logger().error(`${this.log.loggerInfo('유저가 없을 경우')}`);
        return {
          ok: false,
          error: '유저가 존재 하지 않습니다',
        };
      }
      const followers = await this.prisma.user.findUnique({ where: { username } }).followers({
        take: 5,
        skip: (page - 1) * 5,
      });

      const totalFollowers = await this.prisma.user.count({ where: { following: { some: { username } } } });
      // * 팔로워 조회 완료
      this.log.logger().info(`${this.log.loggerInfo('팔로워 조회 완료')}`);
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
    } catch (error) {
      // ! extraError
      const { message, name, stack } = error;
      this.log.logger().error(`${this.log.loggerInfo('extraError', message, name, stack)}`);
      return {
        ok: false,
        error: 'existError',
      };
    }
  }

  async seeFollowing(userId: number, { username, lastId }: SeeFollowingInput): Promise<SeeFollowingOutput> {
    try {
      const ok = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
      if (!ok) {
        // ! 유저가 없을 경우
        this.log.logger().error(`${this.log.loggerInfo('유저가 없을 경우')}`);
        return {
          ok: false,
          error: '유저가 존재 하지 않습니다',
        };
      }
      const following = await this.prisma.user.findUnique({ where: { username } }).following({
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
      // * 팔로잉 조회 완료
      this.log.logger().info(`${this.log.loggerInfo('팔로잉 조회 완료')}`);
      return {
        ok: true,
        following,
      };
    } catch (error) {
      // ! extraError
      const { message, name, stack } = error;
      this.log.logger().error(`${this.log.loggerInfo('extraError', message, name, stack)}`);
      return {
        ok: false,
        error: 'existError',
      };
    }
  }

  async searchUsers(userId: number, { keyword }: SearchUsersInput): Promise<SearchUsersOutput> {
    try {
      // ! 데이터베이스에서 유저들 찾기
      const users = await this.prisma.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
      });

      // ! 데이터베이스에서 유저 찾기
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          following: true,
          followers: true,
        },
      });

      const totalFollowing = await this.totalFollowing(userId);
      const totalFollowers = await this.totalFollowers(userId);
      const isMe = this.isMe(user, userId);
      const isFollowing = await this.isFollowing(user, userId);

      return {
        ok: true,
        users,
        totalFollowing,
        totalFollowers,
        isMe,
        isFollowing,
      };
    } catch (error) {}
  }
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetUserInput, GetUserOutput } from "./dtos/get-user.dto";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import * as bcrypt from "bcrypt";
import { LoggerService } from "../libs/logger/logger.service";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { JwtService } from "../libs/jwt/jwt.service";
import { EditProfileOutput } from "./dtos/edit-profile.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LoggerService,
    private readonly jwtService: JwtService) {
  }

  async getUser({ id }: GetUserInput): Promise<GetUserOutput> {
    try {
      // ! 데이터베이스에서 유저 찾기
      const user = await this.prisma.user.findUnique({
        where: {
          id
        }
      });

      // ! 유저가 있을 경우
      this.log.logger().info(`${this.log.loggerInfo("유저 찾기")}`);
      return {
        ok: true,
        user
      };

    } catch (error) {
      //! extraError
      const { message, name, stack } = error;
      this.log.logger().error(`${this.log.loggerInfo("extraError", message, name, stack)}`);
      return {
        ok: false,
        error: "User not found"
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
              username
            }
          ]
        }
      });
      if (exists) {
        // ! 유저 네임이 이미 존재할 경우
        this.log.logger().error(`${this.log.loggerInfo("유저 네임이 이미 존재할 경우")}`);
        return {
          ok: false,
          error: "existError"
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          username,
          password: hashedPassword
        }
      });

      return {
        ok: true
      };
    } catch (error) {
      //! extraError
      const { message, name, stack } = error;
      this.log.logger().error(`${this.log.loggerInfo("extraError", message, name, stack)}`);
      return {
        ok: false,
        error: "Could not create account"
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      // ! 데이터베이스에서 유저 찾기
      const user = await this.prisma.user.findUnique({
        where: {
          email
        }
      });

      // ! 유저가 없을 경우
      if (!user) {
        this.log.logger().error(`${this.log.loggerInfo("유저가 없을 경우")}`);
        return {
          ok: false,
          error: "User not found"
        };
      }

      // ! 비밀번호 확인
      const passwordOk = await bcrypt.compare(password, user.password);

      // ! 비밀번호가 틀릴 경우
      if (!passwordOk) {
        this.log.logger().error(`${this.log.loggerInfo("비밀번호가 틀릴 경우")}`);
        return {
          ok: false,
          error: "Wrong password"
        };
      }

      const token = this.jwtService.sign({ id: user.id });
      // ! 로그인 성공
      this.log.logger().info(`${this.log.loggerInfo("로그인 성공")}`);
      return {
        ok: true,
        token
      };
    } catch (error) {
      return {
        ok: false,
        error: "existError"
      };
    }
  }

  async editProfile({ email, password, firstName, lastName }): Promise<EditProfileOutput> {
    try {

      return {
        ok: true
      };
    } catch (error) {
      return {
        ok: false,
        error: "existError"
      }
    }
  }

}

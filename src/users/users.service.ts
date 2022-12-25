import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetUserInput, GetUserOutput } from "./dtos/get-user.dto";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
  }

  async getUser({ id }: GetUserInput): Promise<GetUserOutput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id
        }
      });
      console.log(user);
      return {
        ok: true,
        user
      };

    } catch (error) {
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

      await this.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          username,
          password
        }
      });
      return {
        ok: true
      };
    } catch (error) {
      return {
        ok: false,
        error: "Could not create account"
      };
    }
  }
}

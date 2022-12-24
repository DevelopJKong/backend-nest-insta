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

  async createUser(data: CreateUserInput): Promise<CreateUserOutput> {
    try {
      await this.prisma.user.create({
        data
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
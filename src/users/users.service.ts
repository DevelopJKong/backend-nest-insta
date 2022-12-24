import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { GetUserInput } from './dtos/get-user.dto';
import { CreateUserInput } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser({ id }: GetUserInput): Promise<User | null> {
    try {
      return this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createUser(data: CreateUserInput): Promise<User> {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

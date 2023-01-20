import { User } from './../users/entities/user.entity';
import { SendMessageInput } from './dtos/send-message.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeeRoomOutput } from './dtos/see-room.dto';
import { Room as RoomType } from '@prisma/client';
import { Room } from './entities/room.entity';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async seeRooms(userId: number): Promise<SeeRoomOutput> {
    const rooms = await this.prisma.room.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
    return {
      ok: true,
      rooms: rooms as Room[],
    };
  }

  async sendMessage({ payload, roomId, userId }: SendMessageInput, authUser: User) {
    try {
      let room: RoomType;
      if (userId) {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user) {
          return {
            ok: false,
            error: new Error('notFound'),
            message: '유저가 존재 하지 않습니다.',
          };
        }
        room = await this.prisma.room.create({
          data: {
            users: {
              connect: [
                {
                  id: userId,
                },
                {
                  id: authUser.id,
                },
              ],
            },
          },
        });
      } else if (roomId) {
        room = await this.prisma.room.findUnique({
          where: {
            id: roomId,
          },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!room) {
          return {
            ok: false,
            error: new Error('notFound'),
            message: '채팅방이 존재 하지 않습니다.',
          };
        }
      }
      await this.prisma.message.create({
        data: {
          payload,
          room: {
            connect: {
              id: room.id,
            },
          },
          user: {
            connect: {
              id: authUser.id,
            },
          },
        },
      });

      return {
        ok: true,
        message: '메시지를 전송 하였습니다.',
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
}

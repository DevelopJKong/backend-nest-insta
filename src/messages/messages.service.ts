import { Message } from './entities/message.entity';
import { User } from './../users/entities/user.entity';
import { SendMessageInput } from './dtos/send-message.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeeRoomsOutput } from './dtos/see-rooms.dto';
import { Room } from './entities/room.entity';
import { SeeRoomInput, SeeRoomOutput } from './dtos/see-room.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async users(messageId: number): Promise<User[]> {
    const users = await this.prisma.room
      .findUnique({
        where: {
          id: messageId,
        },
      })
      .users();
    return users as User[];
  }

  async messages(roomId: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        roomId,
      },
    });
    return messages as Message[];
  }

  async seeRooms(userId: number): Promise<SeeRoomsOutput> {
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
      message: '채팅방 목록 호출 성공',
      rooms: rooms as Room[],
    };
  }

  async sendMessage({ payload, roomId, userId }: SendMessageInput, authUser: User) {
    try {
      let room: Room;
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
  async seeRoom({ id }: SeeRoomInput, authUser: User): Promise<SeeRoomOutput> {
    try {
      const room = await this.prisma.room.findFirst({
        where: {
          id,
          users: {
            some: {
              id: authUser.id,
            },
          },
        },
      });
      return {
        ok: true,
        room: room as Room,
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
}

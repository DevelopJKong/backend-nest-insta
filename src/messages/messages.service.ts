import { PubSub } from 'graphql-subscriptions';
import { NEW_MESSAGE, PUB_SUB } from './../common/common.constants';
import { LoggerService } from './../libs/logger/logger.service';
import { Message } from './entities/message.entity';
import { User } from './../users/entities/user.entity';
import { SendMessageInput } from './dto/send-message.dto';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeeRoomsOutput } from './dto/see-rooms.dto';
import { Room } from './entities/room.entity';
import { SeeRoomInput, SeeRoomOutput } from './dto/see-room.dto';
import { ReadMessageInput } from './dto/read-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LoggerService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  successLogger(service: { name: string }, method: string) {
    return this.log
      .logger()
      .info(`${service.name} => ${this[`${method}`].name}() | Success Message ::: 데이터 호출 성공`);
  }

  async users(messageId: number): Promise<User[]> {
    const users = await this.prisma.room
      .findUnique({
        where: {
          id: messageId,
        },
      })
      .users();
    this.successLogger(MessagesService, this.users.name);
    return users as User[];
  }

  async messages(roomId: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        roomId,
      },
    });
    this.successLogger(MessagesService, this.messages.name);
    return messages as Message[];
  }

  async unreadTotal(roomId: number, authUser: User): Promise<number> {
    if (!authUser) {
      return 0;
    }
    const count = await this.prisma.message.count({
      where: {
        read: false,
        roomId,
        user: {
          id: {
            not: authUser.id,
          },
        },
      },
    });
    this.successLogger(MessagesService, this.messages.name);
    return count;
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
      include: {
        users: true,
        Message: true,
      },
    });
    return {
      ok: true,
      message: '채팅방 목록 호출 성공',
      rooms: rooms.map(room => ({
        ...room,
        unreadTotal: room.Message.filter(message => message.read === false && message.userId !== userId).length,
      })) as Room[],
    };
  }

  async sendMessage({ payload, roomId, userId }: SendMessageInput, authUser: User) {
    try {
      let room: Room;

      if (!userId) {
        return {
          ok: false,
          error: new Error('notFound'),
          message: '유저가 존재 하지 않습니다.',
        };
      }

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

      if (!roomId) {
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
      } else {
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
      }

      const message = await this.prisma.message.create({
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
        include: {
          user: true,
        },
      });
      // * 메시지 전송시 채팅방 목록에 새로운 메시지가 온 채팅방이 있으면 새로운 메시지를 보여줌
      await this.pubSub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
      return {
        ok: true,
        message: '메시지 전송 성공',
        messages: message as Message,
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
        include: {
          Message: {
            include: {
              user: true,
            },
          },
        },
      });
      return {
        ok: true,
        message: '채팅방 조회 성공',
        room: {
          ...room,
          messages: room.Message,
        } as Room,
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
  async readMessage({ id }: ReadMessageInput, userId: number) {
    try {
      const message = await this.prisma.message.findFirst({
        where: {
          id,
          userId: {
            not: userId,
          },
          room: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (!message) {
        return {
          ok: false,
          error: new Error('notFound'),
          message: '메시지가 존재 하지 않습니다.',
        };
      }

      await this.prisma.message.update({
        where: {
          id,
        },
        data: {
          read: true,
        },
      });
      return {
        ok: true,
        message: '메시지를 읽었습니다.',
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
}

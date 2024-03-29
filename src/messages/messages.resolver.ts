import { PrismaService } from 'src/prisma/prisma.service';
import { NEW_MESSAGE, PUB_SUB } from './../common/common.constants';
import { PubSub } from 'graphql-subscriptions';
import { ReadMessageInput, ReadMessageOutput } from './dto/read-message.dto';
import { Message } from './entities/message.entity';
import { SeeRoomOutput, SeeRoomInput } from './dto/see-room.dto';
import { SendMessageOutput, SendMessageInput } from './dto/send-message.dto';
import { SeeRoomsOutput } from './dto/see-rooms.dto';
import { User } from './../users/entities/user.entity';
import { Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';
import { RoleData } from '@prisma/client';
import { Role } from 'src/libs/auth/role.decorator';
import { Inject } from '@nestjs/common';
import { RoomUpdatesInput } from './dto/room-updates.dto';

@Resolver((_of?: void) => Message)
export class MessagesResolver {
  constructor(
    private readonly messageService: MessagesService,
    private readonly prisma: PrismaService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(_type => SeeRoomsOutput)
  @Role([RoleData.USER])
  async seeRooms(@AuthUser() authUser: User): Promise<SeeRoomsOutput> {
    return this.messageService.seeRooms(authUser.id);
  }

  @Query(_type => SeeRoomOutput)
  @Role([RoleData.USER])
  async seeRoom(@Args('input') seeRoomInput: SeeRoomInput, @AuthUser() authUser: User): Promise<SeeRoomOutput> {
    return this.messageService.seeRoom(seeRoomInput, authUser);
  }

  @Mutation(_type => SendMessageOutput)
  @Role([RoleData.USER])
  async sendMessage(
    @Args('input') sendMessageInput: SendMessageInput,
    @AuthUser() authUser: User,
  ): Promise<SendMessageOutput> {
    return this.messageService.sendMessage(sendMessageInput, authUser);
  }

  @Mutation(_type => ReadMessageOutput)
  @Role([RoleData.USER])
  async readMessage(
    @Args('input') readMessageInput: ReadMessageInput,
    @AuthUser() authUser: User,
  ): Promise<ReadMessageOutput> {
    return this.messageService.readMessage(readMessageInput, authUser.id);
  }

  @Subscription(_returns => Message, {
    // ! resolve: (payload, variables, context, info)
    async resolve({ roomUpdates }, { input: { id } }, { user }, _info) {
      const room = await this.prisma.room.findFirst({
        where: {
          id,
          users: {
            some: {
              id: user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      if (!room) {
        throw new Error('You shall not see this.');
      }
      return roomUpdates;
    },
    // ! filter: (payload, variables, context)
    async filter({ roomUpdates: { roomId } }, { input: { id } }, { user }) {
      if (roomId !== id) {
        return false;
      }
      const room = await this.prisma.room.findFirst({
        where: {
          id,
          users: {
            some: {
              id: user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      if (!room) {
        return false;
      }
      return true;
    },
  })
  @Role([RoleData.USER])
  async roomUpdates(
    @Args('input') { id }: RoomUpdatesInput, // eslint-disable-line
  ): Promise<AsyncIterator<Message>> {
    return this.pubSub.asyncIterator(NEW_MESSAGE);
  }
  @ResolveField(_type => [User])
  async users(@Parent() message: Message): Promise<User[]> {
    return this.messageService.users(message.id);
  }
  @ResolveField(_type => [Message])
  async message(@Parent() message: Message): Promise<Message[]> {
    return this.messageService.messages(message.id);
  }
  @ResolveField(_type => Number)
  @Role([RoleData.USER])
  async unreadTotal(@Parent() message: Message, @AuthUser() authUser: User): Promise<number> {
    return this.messageService.unreadTotal(message.id, authUser);
  }
}

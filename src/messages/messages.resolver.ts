import { NEW_MESSAGE, PUB_SUB } from './../common/common.constants';
import { PubSub } from 'graphql-subscriptions';
import { ReadMessageInput, ReadMessageOutput } from './dtos/read-message.dto';
import { Message } from './entities/message.entity';
import { SeeRoomOutput, SeeRoomInput } from './dtos/see-room.dto';
import { SendMessageOutput, SendMessageInput } from './dtos/send-message.dto';
import { SeeRoomsOutput } from './dtos/see-rooms.dto';
import { User } from './../users/entities/user.entity';
import { Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';
import { RoleData } from '@prisma/client';
import { Role } from 'src/libs/auth/role.decorator';
import { Inject } from '@nestjs/common';

@Resolver((_of?: void) => Message)
export class MessagesResolver {
  constructor(private readonly messageService: MessagesService, @Inject(PUB_SUB) private readonly pubSub: PubSub) {}

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

  @Subscription(_returns => Message)
  async roomUpdates() {
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

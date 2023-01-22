import { Message } from './entities/message.entity';
import { SeeRoomOutput, SeeRoomInput } from './dtos/see-room.dto';
import { SendMessageOutput, SendMessageInput } from './dtos/send-message.dto';
import { SeeRoomsOutput } from './dtos/see-rooms.dto';
import { User } from './../users/entities/user.entity';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';

@Resolver(_of => Message)
export class MessagesResolver {
  constructor(private readonly messageService: MessagesService) {}

  @Query(_type => SeeRoomsOutput)
  async seeRooms(@AuthUser() authUser: User): Promise<SeeRoomsOutput> {
    return this.messageService.seeRooms(authUser.id);
  }

  @Query(_type => SeeRoomOutput)
  async seeRoom(@Args('input') seeRoomInput: SeeRoomInput, @AuthUser() authUser: User): Promise<SeeRoomOutput> {
    return this.messageService.seeRoom(seeRoomInput, authUser);
  }

  @Mutation(_type => SendMessageOutput)
  async sendMessage(
    @Args('input') sendMessageInput: SendMessageInput,
    @AuthUser() authUser: User,
  ): Promise<SendMessageOutput> {
    return this.messageService.sendMessage(sendMessageInput, authUser);
  }

  @ResolveField(_type => [User])
  async users(@Parent() message: Message): Promise<User[]> {
    return this.messageService.users(message.id);
  }
  @ResolveField(_type => [Message])
  async message(@Parent() message: Message): Promise<Message[]> {
    return this.messageService.messages(message.id);
  }
}

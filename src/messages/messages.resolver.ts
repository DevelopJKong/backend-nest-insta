import { SendMessageOutput, SendMessageInput } from './dtos/send-message.dto';
import { SeeRoomOutput } from './dtos/see-room.dto';
import { User } from './../users/entities/user.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';

@Resolver()
export class MessagesResolver {
  constructor(private readonly messageService: MessagesService) {}

  @Query(_type => SeeRoomOutput)
  async seeRooms(@AuthUser() authUser: User): Promise<SeeRoomOutput> {
    return this.messageService.seeRooms(authUser.id);
  }

  @Mutation(_type => SendMessageOutput)
  async sendMessage(
    @Args('input') sendMessageInput: SendMessageInput,
    @AuthUser() authUser: User,
  ): Promise<SendMessageOutput> {
    return this.messageService.sendMessage(sendMessageInput, authUser);
  }
}

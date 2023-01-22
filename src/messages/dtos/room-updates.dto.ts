import { Message } from './../entities/message.entity';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class RoomUpdatesInput extends PickType(Message, ['id', 'payload'] as const) {}

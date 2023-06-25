import { Message } from '../entities/message.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dto/output.dto';
import { IsOptional } from 'class-validator';

@InputType()
export class SendMessageInput extends PickType(Message, ['payload'] as const) {
  @Field(_type => Number, { nullable: true })
  @IsOptional()
  roomId?: number;

  @Field(_type => Number, { nullable: true })
  @IsOptional()
  userId?: number;
}

@ObjectType()
export class SendMessageOutput extends CoreOutput {}

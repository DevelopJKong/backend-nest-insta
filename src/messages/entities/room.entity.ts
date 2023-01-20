import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Message } from './message.entity';
import { IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { CoreEntity } from 'src/common/entites/core.entity';

@InputType('RoomInputType', { isAbstract: true })
@ObjectType()
export class Room extends CoreEntity {
  @Field(_type => [Message], { nullable: true })
  @IsOptional()
  messages: Message[];

  @Field(_type => [User], { nullable: true })
  @IsOptional()
  users: User[];

  @Field(_type => [Room], { nullable: true })
  @IsOptional()
  rooms: Room[];
}

import { User } from './../../users/entities/user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entites/core.entity';
import { IsOptional, IsString } from 'class-validator';
import { Room } from './room.entity';

@InputType('MessageInputType', { isAbstract: true })
@ObjectType()
export class Message extends CoreEntity {
  @Field(_type => String)
  @IsString()
  payload: string;

  @Field(_type => User, { nullable: true })
  @IsOptional()
  user?: User;

  @Field(_type => Room, { nullable: true })
  @IsOptional()
  room?: Room;
}

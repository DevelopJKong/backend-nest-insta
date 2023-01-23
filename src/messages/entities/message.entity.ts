import { User } from './../../users/entities/user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entites/core.entity';
import { IsOptional, IsString } from 'class-validator';
import { Room } from './room.entity';

@InputType('MessageInputType', { isAbstract: true })
@ObjectType()
export class Message extends CoreEntity {
  @Field(_type => String, { nullable: true })
  @IsString()
  @IsOptional()
  payload?: string;

  @Field(_type => Number, { nullable: true })
  @IsOptional()
  roomId?: number;

  @Field(_type => Number, { nullable: true })
  @IsOptional()
  userId?: number;

  @Field(_type => User, { nullable: true })
  @IsOptional()
  user?: User;

  @Field(_type => Room, { nullable: true })
  @IsOptional()
  room?: Room;

  @Field(_type => Boolean, { nullable: true })
  @IsOptional()
  read?: boolean;
}

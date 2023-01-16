import { Photo } from './../../photos/entities/photo.entity';
import { User } from './../../users/entities/user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entites/core.entity';
import { IsOptional } from 'class-validator';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
export class Comment extends CoreEntity {
  @Field(_type => String)
  payload: string;

  @Field(_type => Boolean)
  isMine: boolean;

  @Field(_type => User, { nullable: true })
  @IsOptional()
  user?: User;

  @Field(_type => Photo, { nullable: true })
  @IsOptional()
  photo?: Photo;
}

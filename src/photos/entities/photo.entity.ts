import { Hashtag } from './hashtag.entity';
import { User } from './../../users/entities/user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entites/core.entity';
import { IsArray, IsNumber, IsOptional, IsBoolean, IsObject, IsString } from 'class-validator';
import { Comment } from 'src/comments/entities/comment.entity';

@InputType('PhotoInputType', { isAbstract: true })
@ObjectType()
export class Photo extends CoreEntity {
  @Field(_type => String)
  @IsString({ message: 'File must be a string' })
  file: string;

  @Field(_type => String, { nullable: true })
  @IsString({ message: 'Caption must be a string' })
  @IsOptional()
  caption?: string;

  @Field(_type => User, { nullable: true })
  @IsObject({ message: 'User must be an object' })
  @IsOptional()
  user?: User;

  @Field(_type => [Hashtag], { nullable: true })
  @IsArray({ message: 'Hashtags must be an array' })
  @IsOptional()
  hashtags?: Hashtag[];

  @Field(_type => Number, { nullable: true })
  @IsNumber({ allowNaN: false }, { message: 'Likes must be a number' })
  @IsOptional()
  likes?: number;

  @Field(_type => Boolean, { nullable: true })
  @IsBoolean({ message: 'Is mine must be a boolean' })
  @IsOptional()
  isMine?: Boolean;

  @Field(_type => Number, { nullable: true })
  @IsNumber({ allowNaN: false }, { message: 'Comment number must be a number' })
  @IsOptional()
  commentNumber?: number;

  @Field(_type => [Comment], { nullable: true })
  @IsArray({ message: 'Comments must be an array' })
  @IsOptional()
  comments?: Comment[];

  @Field(_type => Boolean, { nullable: true })
  @IsBoolean({ message: 'Is liked must be a boolean' })
  @IsOptional()
  isLiked?: Boolean;
}

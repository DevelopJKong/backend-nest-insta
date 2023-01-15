import { Hashtag } from './hashtag.entity';
import { User } from './../../users/entities/user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entites/core.entity';
import { IsOptional } from 'class-validator';

@InputType('PhotoInputType', { isAbstract: true })
@ObjectType()
export class Photo extends CoreEntity {
  @Field(_type => String)
  file: string;

  @Field(_type => String, { nullable: true })
  @IsOptional()
  caption?: string;

  @Field(_type => User, { nullable: true })
  @IsOptional()
  user?: User;

  @Field(_type => [Hashtag], { nullable: true })
  @IsOptional()
  hashtags?: Hashtag[];

  @Field(_type => Number, { nullable: true })
  @IsOptional()
  likes?: number;
}

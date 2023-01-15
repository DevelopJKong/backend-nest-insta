import { Photo } from './photo.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entites/core.entity';
import { IsOptional } from 'class-validator';

@InputType('LikeInputType', { isAbstract: true })
@ObjectType()
export class Like extends CoreEntity {
  @Field(_type => Photo, { nullable: true })
  @IsOptional()
  photo: Photo;
}

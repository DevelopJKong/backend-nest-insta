import { Photo } from './photo.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from '../../common/entites/core.entity';
import { IsOptional } from 'class-validator';

@InputType('HashtagInputType', { isAbstract: true })
@ObjectType()
export class Hashtag extends CoreEntity {
  @Field(_type => String)
  hashtag: string;

  @Field(_type => [Photo], { nullable: true })
  @IsOptional()
  photos?: Photo[];

  @Field(_type => Number)
  totalPhotos: number;
}

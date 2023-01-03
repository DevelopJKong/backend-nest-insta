import { Photo } from '../../photos/entities/photo.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from '../../common/entites/core.entity';

@InputType('HashtagInputType', { isAbstract: true })
@ObjectType()
export class Hashtag extends CoreEntity {
  @Field(_type => String)
  hashtag: string;

  @Field(_type => [Photo])
  photos: Photo[];
}

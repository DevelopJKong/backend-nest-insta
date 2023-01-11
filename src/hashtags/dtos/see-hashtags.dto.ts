import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Hashtag } from '../entities/hashtag.entity';

@InputType()
export class SeeHashTagInput extends PickType(Hashtag, ['hashtag']) {}

@ObjectType()
export class SeeHashTagOutput extends CoreOutput {
  @Field(_type => Hashtag, { nullable: true })
  hashtag?: Hashtag;
}

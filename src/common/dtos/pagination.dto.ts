import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(_return => Number, { nullable: true })
  totalFollowing?: number;

  @Field(_return => Number, { nullable: true })
  totalFollowers?: number;

  @Field(_return => Boolean, { nullable: true })
  isMe?: boolean;

  @Field(_return => Boolean, { nullable: true })
  isFollowing?: boolean;
}

import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResolveFieldUserTotalFollowingOutput extends CoreOutput {
  @Field(_type => Number, { nullable: true })
  count: number;
}

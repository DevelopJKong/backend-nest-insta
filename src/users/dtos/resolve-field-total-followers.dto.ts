import { Field } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class ResolveFieldTotalFollowersOutput extends CoreOutput {
  @Field(() => Number)
  count: number;
}

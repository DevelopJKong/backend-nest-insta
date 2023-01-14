import { User } from './../../users/entities/user.entity';
import { Field } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class ResolveFieldUserOutput extends CoreOutput {
  @Field(_type => User, { nullable: true })
  user?: User;
}

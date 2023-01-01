import { CoreOutput } from './../../common/dtos/output.dto';
import { InputType, Field, PickType, ObjectType } from '@nestjs/graphql';
import { User } from './../entities/user.entity';

@InputType()
export class SeeFollowingInput extends PickType(User, ['username']) {
  @Field(_type => Number)
  lastId: number;
}

@ObjectType()
export class SeeFollowingOutput extends CoreOutput {
  @Field(_type => [User], { nullable: true })
  following?: User[];

  @Field(_type => Number, { nullable: true })
  totalPages?: number;
}

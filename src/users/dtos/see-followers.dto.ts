import { User } from './../entities/user.entity';
import { CoreOutput } from './../../common/dtos/output.dto';
import { InputType, ObjectType, Field, PickType } from '@nestjs/graphql';

@InputType()
export class SeeFollowersInput extends PickType(User, ['username']) {
  @Field(_type => Number)
  page: number;
}

@ObjectType()
export class SeeFollowersOutput extends CoreOutput {
  @Field(_type => [User], { nullable: true })
  followers?: User[];

  @Field(_type => Number, { nullable: true })
  totalPages?: number;
}

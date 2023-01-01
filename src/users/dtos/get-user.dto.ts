import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class GetUserInput extends PickType(User, ['id']) {}

@ObjectType()
export class GetUserOutput extends CoreOutput {
  @Field(_returns => User)
  user?: User;

  @Field(_return => Number, { nullable: true })
  totalFollowing?: number;

  @Field(_return => Number, { nullable: true })
  totalFollowers?: number;

  @Field(_return => Boolean, { nullable: true })
  isMe?: boolean;

  @Field(_return => Boolean, { nullable: true })
  isFollowing?: boolean;
}

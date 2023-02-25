import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class FollowUserInput extends PickType(User, ['username']) {}

@ObjectType()
export class FollowUserOutput extends CoreOutput {}

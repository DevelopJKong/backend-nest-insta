import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UnFollowUserInput extends PickType(User, ['username']) {}

@ObjectType()
export class UnFollowUserOutput extends CoreOutput {}

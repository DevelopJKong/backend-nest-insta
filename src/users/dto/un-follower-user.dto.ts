import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UnFollowerUserInput extends PickType(User, ['username']) {}

@ObjectType()
export class UnFollowerUserOutput extends CoreOutput {}

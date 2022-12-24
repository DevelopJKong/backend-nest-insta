import { CoreOutput } from './../../common/dtos/output.dto';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class GetUserInput extends PickType(User, ['id']) {}

@ObjectType()
export class GetUserOutput extends CoreOutput {}

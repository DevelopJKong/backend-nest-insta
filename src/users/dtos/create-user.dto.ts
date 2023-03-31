import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput extends PickType(User, ['firstName', 'lastName', 'email', 'password'] as const) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {}

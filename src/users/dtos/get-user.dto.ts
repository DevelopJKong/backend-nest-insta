import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { PaginationOutput } from 'src/common/dtos/pagination.dto';
import { IsOptional } from 'class-validator';

@InputType()
export class GetUserInput extends PickType(User, ['id']) {}

@ObjectType()
export class GetUserOutput extends PaginationOutput {
  @Field(_returns => User)
  @IsOptional()
  user?: User;
}

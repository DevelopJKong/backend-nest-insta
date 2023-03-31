import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { PaginationOutput } from 'src/common/dtos/pagination.dto';
import { IsOptional } from 'class-validator';

@InputType()
export class SeeProfileInput extends PickType(User, ['username'] as const) {}

@ObjectType()
export class SeeProfileOutput extends PaginationOutput {
  @Field(_returns => User)
  @IsOptional()
  user?: User;
}

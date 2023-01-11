import { PaginationOutput } from './../../common/dtos/pagination.dto';
import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { IsOptional } from 'class-validator';

@InputType()
export class SearchUsersInput {
  @Field(_type => String)
  keyword: string;
}

@ObjectType()
export class SearchUsersOutput extends PaginationOutput {
  @Field(_type => [User], { nullable: true })
  @IsOptional()
  users?: User[];
}

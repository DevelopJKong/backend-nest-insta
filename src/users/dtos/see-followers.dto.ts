import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';
import { InputType, ObjectType, Field, PickType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class SeeFollowersInput extends PickType(User, ['username']) {
  @Field(_type => Number)
  page: number;
}

@ObjectType()
export class SeeFollowersOutput extends CoreOutput {
  @Field(_type => [User], { nullable: true })
  @IsOptional()
  followers?: User[];

  @Field(_type => Number, { nullable: true })
  @IsOptional()
  totalPages?: number;
}

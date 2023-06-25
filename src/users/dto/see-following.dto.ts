import { CoreOutput } from '../../common/dto/output.dto';
import { InputType, Field, PickType, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { IsOptional } from 'class-validator';

@InputType()
export class SeeFollowingInput extends PickType(User, ['username']) {
  @Field(_type => Number)
  lastId: number;
}

@ObjectType()
export class SeeFollowingOutput extends CoreOutput {
  @Field(_type => [User], { nullable: true })
  @IsOptional()
  following?: User[];

  @Field(_type => Number, { nullable: true })
  @IsOptional()
  totalPages?: number;
}

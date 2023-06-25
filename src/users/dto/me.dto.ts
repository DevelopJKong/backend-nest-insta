import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dto/output.dto';
import { IsObject, IsOptional } from 'class-validator';

@ObjectType()
export class MeOutput extends CoreOutput {
  @Field(_type => User, { nullable: true })
  @IsOptional()
  @IsObject({ message: 'User 는 객체여야 합니다' })
  user?: User;
}

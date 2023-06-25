import { Field, ObjectType, PickType, InputType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dto/output.dto';
import { IsJWT, IsOptional } from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(_type => String, { nullable: true })
  @IsJWT()
  @IsOptional()
  token?: string;
}

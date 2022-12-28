<<<<<<< HEAD
import { Field, ArgsType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { IsJWT } from 'class-validator';
import { User } from '../entities/user.entity';

@ArgsType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((_type) => String, { nullable: true })
  @IsJWT()
  token?: string;
}
=======
import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/output.dto";
import { IsJWT } from "class-validator";
import { User } from "../entities/user.entity";

@InputType()
export class LoginInput extends PickType(User, [
  "email",
  "password"
]) {
}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(_type => String, { nullable: true })
  @IsJWT()
  token?: string;
}



>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272

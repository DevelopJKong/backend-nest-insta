import { CoreEntity } from './../../common/entites/core.entity';
import { InputType, ObjectType, Field } from '@nestjs/graphql';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
export class User extends CoreEntity {
  @Field((_type) => String)
  firstName: string;

  @Field((_type) => String)
  lastName: string;

  @Field((_type) => String)
  username: string;

  @Field((_type) => String)
  email: string;

  @Field((_type) => String)
  password: string;
}

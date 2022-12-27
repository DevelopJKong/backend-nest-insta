import { IsEmail, IsEnum, IsString } from 'class-validator';
import { CoreEntity } from './../../common/entites/core.entity';
import { InputType, ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

registerEnumType(Role, { name: 'Role' });
@InputType('UserInputType', { isAbstract: true })
@ObjectType()
export class User extends CoreEntity {
  @Field((_type) => String)
  @IsString()
  firstName: string;

  @Field((_type) => String)
  @IsString()
  lastName: string;

  @Field((_type) => String)
  @IsString()
  username: string;

  @Field((_type) => String)
  @IsEmail()
  email: string;

  @Field((_type) => String)
  @IsString()
  password: string;

  @Field((_type) => Role)
  @IsEnum(Role)
  role: Role;
}

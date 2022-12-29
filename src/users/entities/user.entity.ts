import { IsEmail, IsEnum, IsString } from 'class-validator';
import { CoreEntity } from './../../common/entites/core.entity';
import { InputType, ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { RoleData } from '@prisma/client';

registerEnumType(RoleData, { name: 'Role' });
@InputType('UserInputType', { isAbstract: true })
@ObjectType()
export class User extends CoreEntity {
  @Field(_type => String)
  @IsString()
  firstName: string;

  @Field(_type => String)
  @IsString()
  lastName: string;

  @Field(_type => String)
  @IsString()
  username: string;

  @Field(_type => String)
  @IsEmail()
  email: string;

  @Field(_type => String)
  @IsString()
  password: string;

  @Field(_type => RoleData)
  @IsEnum(RoleData)
  role: RoleData;

  @Field(_type => String, { nullable: true })
  @IsString()
  bio?: string;

  @Field(_type => String, { nullable: true })
  avatar?: string;
}

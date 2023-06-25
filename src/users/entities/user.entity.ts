import { Photo } from './../../photos/entities/photo.entity';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
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
  @IsOptional()
  bio?: string;

  @Field(_type => String, { nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string;

  @Field(_type => [User], { nullable: true })
  @IsOptional()
  following?: User[];

  @Field(_type => [User], { nullable: true })
  @IsOptional()
  followers?: User[];

  @Field(_type => [Photo], { nullable: true })
  @IsOptional()
  photos?: Photo[];

  @Field(_type => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  totalFollowing?: number;

  @Field(_type => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  totalFollowers?: number;

  @Field(_type => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isFollowing?: boolean;

  @Field(_type => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isFollowingCheck?: boolean;

  @Field(_type => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isMe?: boolean;

  @Field(_type => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  comments?: number;
}

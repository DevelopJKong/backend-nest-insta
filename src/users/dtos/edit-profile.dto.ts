import { FileUpload } from './../../common/common.interface';
import { InputType, ObjectType, PickType, PartialType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { IsOptional } from 'class-validator';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password', 'firstName', 'lastName', 'username', 'bio']),
) {
  @Field(_type => GraphQLUpload, { nullable: true })
  @IsOptional()
  avatarField?: Promise<FileUpload>;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

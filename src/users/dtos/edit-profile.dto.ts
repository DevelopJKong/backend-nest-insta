import { FileUpload } from './../../common/common.interface';
import { InputType, ObjectType, PickType, PartialType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password', 'firstName', 'lastName', 'username', 'bio']),
) {
  @Field(_type => GraphQLUpload, { nullable: true })
  avatarField?: Promise<FileUpload>;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

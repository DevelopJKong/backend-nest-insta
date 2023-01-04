import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from './../../common/common.interface';
import { CoreOutput } from './../../common/dtos/output.dto';
import { Photo } from './../entities/photo.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class UploadPhotoInput extends PickType(Photo, ['caption']) {
  @Field(_type => GraphQLUpload, { nullable: true })
  photoFile?: Promise<FileUpload>;
}

@ObjectType()
export class UploadPhotoOutput extends CoreOutput {}

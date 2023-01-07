import { CoreOutput } from 'src/common/dtos/output.dto';
import { Photo } from './../entities/photo.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class SeePhotoInput extends PickType(Photo, ['id']) {}

@ObjectType()
export class SeePhotoOutput extends CoreOutput {
  @Field(_type => Photo, { nullable: true })
  photo?: Photo;
}

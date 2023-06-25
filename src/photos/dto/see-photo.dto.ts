import { CoreOutput } from 'src/common/dto/output.dto';
import { Photo } from '../entities/photo.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class SeePhotoInput extends PickType(Photo, ['id']) {}

@ObjectType()
export class SeePhotoOutput extends CoreOutput {
  @Field(_type => Photo, { nullable: true })
  @IsOptional()
  photo?: Photo;
}

import { Photo } from 'src/photos/entities/photo.entity';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from './../../common/dtos/output.dto';

@InputType()
export class DeletePhotoInput extends PickType(Photo, ['id'] as const) {}

@ObjectType()
export class DeletePhotoOutput extends CoreOutput {}

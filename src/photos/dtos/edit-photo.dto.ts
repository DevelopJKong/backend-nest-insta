import { CoreOutput } from 'src/common/dtos/output.dto';
import { Photo } from './../entities/photo.entity';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class EditPhotoInput extends PickType(Photo, ['id', 'caption'] as const) {}

@ObjectType()
export class EditPhotoOutput extends CoreOutput {}

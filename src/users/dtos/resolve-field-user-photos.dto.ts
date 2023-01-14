import { Photo } from './../../photos/entities/photo.entity';
import { Field } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
export class ResolveFieldUserPhotosOutput extends CoreOutput {
  @Field(_type => [Photo], { nullable: true })
  photos?: Photo[];
}

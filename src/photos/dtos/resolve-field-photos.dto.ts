import { Photo } from './../entities/photo.entity';
import { Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class ResolveFieldPhotosOutput extends CoreOutput {
  @Field(_type => [Photo], { nullable: true })
  @IsOptional()
  photos?: Photo[];
}

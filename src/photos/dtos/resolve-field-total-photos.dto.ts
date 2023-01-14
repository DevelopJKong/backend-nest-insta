import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

export class ResolveFieldTotalPhotosOutput extends CoreOutput {
  @Field(_type => Number, { nullable: true })
  @IsOptional()
  totalPhotos?: number;
}

import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Photo } from '../entities/photo.entity';
import { IsOptional } from 'class-validator';

@InputType()
export class SeeFeedInput {}

@ObjectType()
export class SeeFeedOutput extends CoreOutput {
  @Field(_type => [Photo], { nullable: true })
  @IsOptional()
  photos?: Photo[];
}

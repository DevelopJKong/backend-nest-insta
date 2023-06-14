import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Photo } from '../entities/photo.entity';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class SeeFeedInput {
  @Field(_type => Number, { defaultValue: 1 })
  @IsNumber()
  page: number;
}

@ObjectType()
export class SeeFeedOutput extends CoreOutput {
  @Field(_type => [Photo], { nullable: true })
  @IsOptional()
  photos?: Photo[];
}

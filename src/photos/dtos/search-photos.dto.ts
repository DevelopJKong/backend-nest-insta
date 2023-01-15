import { Photo } from '../entities/photo.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class SearchPhotosInput {
  @Field(_type => String, { nullable: true })
  @IsOptional()
  keyword?: string;
}

@ObjectType()
export class SearchPhotosOutput extends CoreOutput {
  @Field(_type => [Photo], { nullable: true })
  photos?: Photo[];
}

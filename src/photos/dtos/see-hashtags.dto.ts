import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Hashtag } from '../entities/hashtag.entity';
import { IsOptional } from 'class-validator';

@InputType()
export class SeeHashTagInput extends PickType(Hashtag, ['hashtag']) {}

@ObjectType()
export class SeeHashTagOutput extends CoreOutput {
  @Field(_type => Hashtag, { nullable: true })
  @IsOptional()
  hashtag?: Hashtag;

  @Field(_type => Number, { nullable: true })
  @IsOptional()
  page?: number;
}

import { Photo } from '../entities/photo.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Hashtag } from '../entities/hashtag.entity';
import { IsOptional } from 'class-validator';

@InputType()
export class SeeHashtagInput extends PickType(Hashtag, ['hashtag']) {
  @Field(_type => Number, { nullable: true })
  @IsOptional()
  page?: number;
}

@ObjectType()
export class SeeHashtagOutput extends CoreOutput {
  @Field(_type => [Photo], { nullable: true })
  @IsOptional()
  photos?: Photo[];

  @Field(_type => Number, { nullable: true })
  @IsOptional()
  totalPhotos?: number;
}

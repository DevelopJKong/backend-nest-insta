import { Hashtag } from 'src/photos/entities/hashtag.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class ResolveFieldHashtagsOutput extends CoreOutput {
  @Field(_type => [Hashtag], { nullable: true })
  @IsOptional()
  hashtags?: Hashtag[];
}

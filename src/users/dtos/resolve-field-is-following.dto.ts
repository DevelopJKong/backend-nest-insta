import { Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

export class ResolveFieldIsFollowingOutput extends CoreOutput {
  @Field(_type => Boolean, { nullable: true })
  @IsOptional()
  isFollowing?: boolean;
}

import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

export class ResolveFieldIsMeOutput extends CoreOutput {
  @Field(_type => Boolean, { nullable: true })
  @IsOptional()
  isMe?: boolean;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class CoreOutput {
  @Field(_type => String, { nullable: true })
  @IsOptional()
  error?: Error;

  @Field(_type => Boolean)
  ok: boolean;

  @Field(_type => String, { nullable: true })
  @IsOptional()
  message?: string;
}

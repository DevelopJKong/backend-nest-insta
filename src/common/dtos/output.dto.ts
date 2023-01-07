import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field(_type => String, { nullable: true })
  error?: Error;

  @Field(_type => Boolean)
  ok: boolean;

  @Field(_type => String, { nullable: true })
  message?: string;
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field((_type) => String, { nullable: true })
  error?: string;

  @Field((_type) => Boolean)
  ok?: boolean;
}

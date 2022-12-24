import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreEntity {
  @Field((_type) => Number)
  id: number;
  @Field((_type) => Date)
  createdAt: Date;
  @Field((_type) => Date)
  updatedAt: Date;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class CoreEntity {
  @Field(_type => Number)
  id: number;
  @Field(_type => Date, { nullable: true })
  @IsOptional()
  createdAt?: Date;
  @Field(_type => Date, { nullable: true })
  @IsOptional()
  updatedAt?: Date;
}

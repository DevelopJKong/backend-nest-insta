import { Field, ObjectType, Int, InputType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(_type => Number, { defaultValue: 1, nullable: true })
  @IsNumber({ allowNaN: false }, { message: '페이지는 숫자여야 합니다.' })
  @IsOptional()
  page?: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(_type => Int, { nullable: true })
  @IsNumber({ allowNaN: false }, { message: '총 페이지는 숫자여야 합니다.' })
  totalPages?: number;
}

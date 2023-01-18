import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class EditCommentInput {
  @Field(_type => Number)
  id: number;

  @Field(_type => String)
  payload: string;
}

@ObjectType()
export class EditCommentOutput extends CoreOutput {}

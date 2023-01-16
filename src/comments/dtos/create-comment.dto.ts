import { CoreOutput } from 'src/common/dtos/output.dto';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';

@InputType()
export class CreateCommentInput extends PickType(Comment, ['payload'] as const) {
  @Field(_type => Number)
  photoId: number;
}

@ObjectType()
export class CreateCommentOutput extends CoreOutput {}

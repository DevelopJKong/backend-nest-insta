import { CoreOutput } from 'src/common/dto/output.dto';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CreateCommentInput extends PickType(Comment, ['payload'] as const) {
  @Field(_type => Number)
  @IsNumber({ allowNaN: false }, { message: 'Photo ID must be a number' })
  photoId: number;
}

@ObjectType()
export class CreateCommentOutput extends CoreOutput {
  @Field(_type => Number)
  @IsNumber({ allowNaN: false }, { message: 'Comment ID must be a number' })
  @IsOptional()
  id?: number;
}

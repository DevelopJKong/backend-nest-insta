import { Comment } from '../entities/comment.entity';
import { CoreOutput } from '../../common/dtos/output.dto';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class DeleteCommentInput extends PickType(Comment, ['id'] as const) {}

@ObjectType()
export class DeleteCommentOutput extends CoreOutput {}

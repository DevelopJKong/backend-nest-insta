import { CreateCommentInput, CreateCommentOutput } from './dtos/create-comment.dto';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(_return => CreateCommentOutput)
  async createComment(
    @Args('input') createCommentInput: CreateCommentInput,
    @AuthUser() authUser,
  ): Promise<CreateCommentOutput> {
    return this.commentsService.createComment(createCommentInput, authUser.id);
  }
}

import { User } from 'src/users/entities/user.entity';
import { RoleData } from '@prisma/client';
import { CreateCommentInput, CreateCommentOutput } from './dtos/create-comment.dto';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';
import { Role } from 'src/libs/auth/role.decorator';
import { Comment } from './entities/comment.entity';

@Resolver(_of => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(_return => CreateCommentOutput)
  @Role([RoleData.USER])
  async createComment(
    @Args('input') createCommentInput: CreateCommentInput,
    @AuthUser() authUser: User,
  ): Promise<CreateCommentOutput> {
    return this.commentsService.createComment(createCommentInput, authUser.id);
  }
}

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentInput, CreateCommentOutput } from './dtos/create-comment.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  isMine(id: number, userId: number) {
    if (!userId) {
      return false;
    }
    return userId === id;
  }

  async createComment({ photoId, payload }: CreateCommentInput, userId: number): Promise<CreateCommentOutput> {
    try {
      const ok = await this.prisma.photo.findUnique({
        where: {
          id: photoId,
        },
        select: {
          id: true,
        },
      });

      if (!ok) {
        return {
          ok: false,
          error: new Error('notFound'),
          message: '포토가 없습니다.',
        };
      }

      await this.prisma.comment.create({
        data: {
          payload,
          photo: {
            connect: {
              id: photoId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
}

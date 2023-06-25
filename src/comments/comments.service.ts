import { EditCommentInput } from './dto/edit-comment.dto';
import { DeleteCommentInput, DeleteCommentOutput } from './dto/delete-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentInput, CreateCommentOutput } from './dto/create-comment.dto';
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
        id: photoId,
        message: '코멘트 생성 성공',
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async deleteComment({ id }: DeleteCommentInput, userId: number): Promise<DeleteCommentOutput> {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
        },
      });

      if (!comment) {
        return {
          ok: false,
          error: new Error('notFound'),
          message: '코멘트가 없습니다.',
        };
      }

      if (comment.userId !== userId) {
        return {
          ok: false,
          error: new Error('notAuthorized'),
          message: '권한이 없습니다.',
        };
      }

      await this.prisma.comment.delete({
        where: {
          id,
        },
      });

      return {
        ok: true,
        message: '코멘트 삭제 성공',
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async editComment({ id, payload }: EditCommentInput, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });

    if (!comment) {
      return {
        ok: false,
        error: new Error('notFound'),
        message: '코멘트가 없습니다.',
      };
    }

    if (comment.userId !== userId) {
      return {
        ok: false,
        error: new Error('notAuthorized'),
        message: '권한이 없습니다.',
      };
    }

    await this.prisma.comment.update({
      where: {
        id,
      },
      data: {
        payload,
      },
    });

    try {
      return {
        ok: true,
        message: '코멘트 수정 성공',
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
}

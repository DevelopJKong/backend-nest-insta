import { SeeLikesOutput } from './dtos/see-likes.dto';
import { ToggleLikeInput, ToggleLikeOutput } from './dtos/toggle-like.dto';
import { EditPhotoInput, EditPhotoOutput } from './dtos/edit-photo.dto';
import { SearchPhotosOutput, SearchPhotosInput } from './dtos/search-photos.dto';
import { processHashtags } from './../libs/utils/process-hashtag';
import { LoggerService } from './../libs/logger/logger.service';
import { User } from './../users/entities/user.entity';
import { SeePhotoOutput, SeePhotoInput } from './dtos/see-photo.dto';
import { PrismaService } from './../prisma/prisma.service';
import { UploadPhotoInput, UploadPhotoOutput } from './dtos/upload-photo.dto';
import { Injectable } from '@nestjs/common';
import { Hashtag } from 'src/photos/entities/hashtag.entity';
import { SeeHashtagInput, SeeHashtagOutput } from './dtos/see-hashtags.dto';
import { Photo } from './entities/photo.entity';
import { SeeFeedOutput } from './dtos/see-feed.dto';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService, private readonly log: LoggerService) {}

  successLogger(method: string) {
    return this.log
      .logger()
      .info(`${PhotosService.name} => ${this[`${method}`].name}() | Success Message ::: 데이터 호출 성공`);
  }

  async user(id: number): Promise<User> {
    // ! 포토 유저 호출 성공
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (process.env.NODE_ENV === 'dev') this.successLogger(this.user.name);
    return user as User;
  }

  async hashtags(id: number): Promise<Hashtag[]> {
    // ! 포토 해시태그 호출 성공
    const hashtags = await this.prisma.hashtag.findMany({
      where: {
        photos: {
          some: {
            id,
          },
        },
      },
    });
    if (process.env.NODE_ENV === 'dev') this.successLogger(this.hashtags.name);
    return hashtags as Hashtag[];
  }

  async photos(id: number, page: number, userId: number): Promise<Photo[]> {
    if (!userId) {
      // ! 포토 호출 실패
      return null;
    }
    // ! 포토 호출 성공
    const photos = await this.prisma.hashtag
      .findUnique({
        where: {
          id,
        },
      })
      .photos({
        take: 5,
        skip: (page - 1) * 5,
      });
    if (process.env.NODE_ENV === 'dev') this.successLogger(this.photos.name);
    return photos as Photo[];
  }

  async totalPhotos(id: number): Promise<number> {
    // ! 포토 총 사진 호출 성공
    const totalPhotos = await this.prisma.photo.count({
      where: {
        hashtags: {
          some: {
            id,
          },
        },
      },
    });
    if (process.env.NODE_ENV === 'dev') this.successLogger(this.totalPhotos.name);
    return totalPhotos;
  }

  async likes(id: number): Promise<number> {
    return this.prisma.like
      .count({
        where: {
          photoId: id,
        },
      })
      .catch(error => error && 0);
  }

  async uploadPhoto(userId: number, { photoFile, caption }: UploadPhotoInput): Promise<UploadPhotoOutput> {
    try {
      let hashtagObj = [];

      if (caption) {
        hashtagObj = processHashtags(caption);
      }

      const { filename } = await photoFile;
      await this.prisma.photo.create({
        data: {
          file: filename,
          caption,
          user: {
            connect: {
              id: userId,
            },
          },
          ...(hashtagObj.length > 0 && {
            hashtags: {
              connectOrCreate: hashtagObj,
            },
          }),
        },
      });

      return {
        ok: true,
        message: '사진 업로드 성공',
      };
    } catch (error) {
      return {
        ok: false,
        error: new Error(error),
        message: 'extraError',
      };
    }
  }

  async seePhoto({ id }: SeePhotoInput): Promise<SeePhotoOutput> {
    try {
      const photo = await this.prisma.photo.findUnique({
        where: {
          id,
        },
      });

      return {
        photo: {
          ...photo,
          hashtags: await this.hashtags(photo.id),
          user: await this.user(photo.userId),
          likes: await this.likes(photo.id),
        },
        ok: true,
        message: '사진 보기 성공',
      };
    } catch (error) {
      return {
        ok: false,
        error: new Error(error),
        message: 'extraError',
      };
    }
  }

  async seeHashtag({ hashtag, page }: SeeHashtagInput, userId: number): Promise<SeeHashtagOutput> {
    try {
      const tag = await this.prisma.hashtag.findUnique({
        where: {
          hashtag,
        },
      });
      if (!tag) {
        return {
          ok: false,
          error: new Error('해시태그 없음'),
          message: '해시태그 없음',
        };
      }
      return {
        ok: true,
        photos: await this.photos(tag.id, page, userId),
        totalPhotos: await this.totalPhotos(tag.id),
        message: '해시태크 보기 성공',
      };
    } catch (error) {
      return {
        ok: false,
        error: new Error(error),
        message: 'extraError',
      };
    }
  }
  async searchPhotos({ keyword }: SearchPhotosInput): Promise<SearchPhotosOutput> {
    try {
      const photos = await this.prisma.photo.findMany({
        where: { caption: { contains: keyword } },
      });

      return {
        ok: true,
        photos: photos as Photo[],
        message: '사진 검색 성공',
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError', photos: null };
    }
  }

  async editPhoto({ id, caption }: EditPhotoInput, userId: number): Promise<EditPhotoOutput> {
    try {
      const oldPhotos = await this.prisma.photo.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          hashtags: {
            select: {
              hashtag: true,
            },
          },
        },
      });

      if (!oldPhotos) {
        return {
          ok: false,
          error: new Error('unAuthorized'),
          message: '포토를 수정할 권한이 없습니다.',
        };
      }

      await this.prisma.photo.update({
        where: {
          id,
        },
        data: {
          caption,
          hashtags: {
            disconnect: oldPhotos.hashtags,
            connectOrCreate: processHashtags(caption),
          },
        },
      });
      return {
        ok: true,
        message: '사진 수정 성공',
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
  async toggleLike({ id }: ToggleLikeInput, userId: number): Promise<ToggleLikeOutput> {
    try {
      const photo = await this.prisma.photo.findUnique({
        where: {
          id,
        },
      });

      if (!photo) {
        return {
          ok: false,
          error: new Error('notFound'),
          message: '포토가 없습니다.',
        };
      }

      const likeWhere = {
        photoId_userId: {
          userId: userId,
          photoId: id,
        },
      };
      const like = await this.prisma.like.findUnique({
        where: likeWhere,
      });

      if (like) {
        await this.prisma.like.delete({
          where: likeWhere,
        });
      } else {
        await this.prisma.like.create({
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            photo: {
              connect: {
                id: photo.id,
              },
            },
          },
        });
      }

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async seeLikes(id: number): Promise<SeeLikesOutput> {
    try {
      const likes = await this.prisma.like.findMany({
        where: {
          photoId: id,
        },
        select: {
          user: true,
        },
      });
      return {
        ok: true,
        user: likes.map(like => like.user),
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async seeFeed(userId: number): Promise<SeeFeedOutput> {
    const firstCondition = {
      user: {
        followers: {
          some: {
            id: userId,
          },
        },
      },
    };

    const secondCondition = {
      userId,
    };

    try {
      const photos = await this.prisma.photo.findMany({
        where: {
          OR: [firstCondition, secondCondition],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return {
        ok: true,
        photos,
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
}

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

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService, private readonly log: LoggerService) {}

  async user(id: number): Promise<User> {
    // ! 포토 유저 호출 성공
    this.log.logger().info(`${this.log.loggerInfo('포토 유저 호출 성공')}`);
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user as User;
  }

  async hashtags(id: number): Promise<Hashtag[]> {
    // ! 포토 해시태그 호출 성공
    this.log.logger().info(`${this.log.loggerInfo('포토 해시태그 호출 성공')}`);
    const hashtags = await this.prisma.hashtag.findMany({
      where: {
        photos: {
          some: {
            id,
          },
        },
      },
    });
    return hashtags as Hashtag[];
  }

  async photos(id: number, page: number, userId: number): Promise<Photo[]> {
    if (!userId) {
      // ! 포토 호출 실패
      this.log.logger().info(`${this.log.loggerInfo('포토 호출 실패')}`);
      return null;
    }
    // ! 포토 호출 성공
    this.log.logger().info(`${this.log.loggerInfo('포토 호출 성공')}`);
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
    return photos as Photo[];
  }

  async totalPhotos(id: number): Promise<number> {
    // ! 포토 총 사진 호출 성공
    this.log.logger().info(`${this.log.loggerInfo('포토 총 사진 호출 성공')}`);
    const totalPhotos = await this.prisma.photo.count({
      where: {
        hashtags: {
          some: {
            id,
          },
        },
      },
    });
    return totalPhotos;
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
      const ok = await this.prisma.photo.findUnique({
        where: {
          id,
        },
      });

      if (!ok) {
        return {
          ok: false,
          error: new Error('notFound'),
          message: '포토가 없습니다.',
        };
      }

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
}

import { UploadsService } from './../uploads/uploads.service';
import { SeePhotoCommentsInput, SeePhotoCommentsOutput } from './dtos/see-photo-comments.dto';
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
import { SeeFeedOutput } from './dtos/see-feed.dto';
import { Photo } from './entities/photo.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { DeletePhotoInput, DeletePhotoOutput } from './dtos/delete-photo.dto';
import * as chalk from 'chalk';
import * as winston from 'winston';
import { fileFolder, DEV } from '../common/common.constants';
import { join } from 'path';
import * as fs from 'fs';
import { createWriteStream } from 'fs';
import { COMMON_ERROR } from '../common/constants/error.constant';
import { BACKEND_URL } from './../common/common.constants';
import { PHOTO_SUCCESS } from '../common/constants/success.constant';

@Injectable()
export class PhotosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly log: LoggerService,
    private readonly uploadsService: UploadsService,
  ) {}
  successLogger(service: { name: string }, method: string): winston.Logger {
    const colorName = chalk.yellow(service.name);
    const colorMethod = chalk.cyan(`${this[`${method}`].name}()`);
    const colorSuccess = chalk.green('데이터 호출 성공');
    return this.log.logger().info(`${colorName} => ${colorMethod} | Success Message ::: ${colorSuccess}`);
  }
  async user(id: number): Promise<User> {
    // ! 포토 유저 호출 성공
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    this.successLogger(PhotosService, this.user.name);
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
    this.successLogger(PhotosService, this.hashtags.name);
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
    this.successLogger(PhotosService, this.photos.name);
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
    this.successLogger(PhotosService, this.totalPhotos.name);
    return totalPhotos;
  }

  async likes(id: number): Promise<number> {
    const likes = await this.prisma.like
      .count({
        where: {
          photoId: id,
        },
      })
      .catch(error => error && 0);
    this.successLogger(PhotosService, this.likes.name);
    return likes;
  }

  async comments(id: number): Promise<number> {
    const comments = await this.prisma.comment
      .count({
        where: {
          photoId: id,
        },
      })
      .catch(error => error && 0);
    this.successLogger(PhotosService, this.comments.name);
    return comments;
  }

  isMine(id: number, userId: number) {
    if (!userId) {
      return false;
    }
    return id === userId;
  }

  async isLiked(id: number, userId: number) {
    if (!userId) {
      return false;
    }
    const ok = await this.prisma.like.findUnique({
      where: {
        photoId_userId: {
          photoId: id,
          userId,
        },
      },
      select: {
        id: true,
      },
    });
    if (!ok) {
      return false;
    }
    return true;
  }

  async uploadPhoto(userId: number, { photoFile, caption }: UploadPhotoInput): Promise<UploadPhotoOutput> {
    try {
      let hashtagObj = [];
      let filePath: string;
      let photoFilePath: string;
      if (caption) {
        hashtagObj = processHashtags(caption);
      }
      if (process.env.NODE_ENV === DEV) {
        const { createReadStream, filename } = await photoFile;
        const photoFileFolder = join(fileFolder, './photo');
        if (!fs.existsSync(photoFileFolder)) {
          fs.mkdirSync(photoFileFolder);
        }
        const devResult = createReadStream().pipe(createWriteStream(join(photoFileFolder, `./${filename}`)));
        if (!devResult) {
          return { ok: false, error: new Error('파일 업로드 실패'), message: COMMON_ERROR.extraError.text };
        }
        filePath = devResult.path as string;
        photoFilePath = `${BACKEND_URL}` + join('/files', filePath.split(fileFolder)[1]);
      } else {
        photoFilePath = await this.uploadsService.uploadFile(photoFile, userId, 'upload');
      }
      await this.prisma.photo.create({
        data: {
          file: photoFilePath,
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
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async seePhoto({ id }: SeePhotoInput): Promise<SeePhotoOutput> {
    try {
      const photo = await this.prisma.photo.findUnique({
        where: {
          id,
        },
      });

      const [hashtags, user, likes, comments, isMine, isLiked] = await Promise.all([
        this.hashtags(photo.id),
        this.user(photo.userId),
        this.likes(photo.id),
        this.comments(photo.id),
        this.isMine(photo.userId, photo.id),
        this.isLiked(photo.id, photo.userId),
      ]);

      return {
        photo: {
          ...photo,
          hashtags,
          user,
          likes,
          comments,
          isMine,
          isLiked,
        },
        ok: true,
        message: '사진 보기 성공',
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
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

      const [photos, totalPhotos] = await Promise.all([this.photos(tag.id, page, userId), this.totalPhotos(tag.id)]);

      return {
        ok: true,
        photos,
        totalPhotos,
        message: '해시태크 보기 성공',
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
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
        include: {
          user: true,
        },
      });
      return {
        ok: true,
        message: PHOTO_SUCCESS.seeFeed.text,
        photos: photos as Photo[],
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }

  async seePhotoComments({ id, page }: SeePhotoCommentsInput): Promise<SeePhotoCommentsOutput> {
    try {
      const comments = await this.prisma.comment.findMany({
        where: {
          photoId: id,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 5,
        skip: (page - 1) * 5,
      });
      return {
        ok: true,
        comments: comments as Comment[],
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
  async deletePhoto({ id }: DeletePhotoInput, userId: number): Promise<DeletePhotoOutput> {
    try {
      const photo = await this.prisma.photo.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
        },
      });
      if (!photo) {
        return {
          ok: false,
          error: new Error('notFound'),
          message: '포토가 없습니다.',
        };
      }

      if (photo.userId !== userId) {
        return {
          ok: false,
          error: new Error('unAuthorized'),
          message: '포토를 삭제할 권한이 없습니다.',
        };
      }

      await this.prisma.photo.delete({
        where: {
          id,
        },
      });
      return {
        ok: true,
        message: '사진 삭제 성공',
      };
    } catch (error) {
      return { ok: false, error: new Error(error), message: 'extraError' };
    }
  }
}

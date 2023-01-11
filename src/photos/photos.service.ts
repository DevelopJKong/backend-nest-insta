import { LoggerService } from './../libs/logger/logger.service';
import { User } from './../users/entities/user.entity';
import { SeePhotoOutput, SeePhotoInput } from './dtos/see-photo.dto';
import { PrismaService } from './../prisma/prisma.service';
import { UploadPhotoInput, UploadPhotoOutput } from './dtos/upload-photo.dto';
import { Injectable } from '@nestjs/common';
import { Hashtag } from 'src/photos/entities/hashtag.entity';
import { SeeHashTagInput, SeeHashTagOutput } from './dtos/see-hashtags.dto';

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
        const hashtags = caption.match(/#[\w]+/g);
        hashtagObj = hashtags.map(hashtag => ({ where: { hashtag }, create: { hashtag } }));
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
      };
    }
  }

  async seeHashTag({ hashtag }: SeeHashTagInput): Promise<SeeHashTagOutput> {
    try {
      const tag = await this.prisma.hashtag.findUnique({
        where: {
          hashtag,
        },
      });
      return {
        ok: true,
        hashtag: {
          ...tag,
          totalPhotos: await this.totalPhotos(tag.id),
        },
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
}

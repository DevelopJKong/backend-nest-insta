import { LoggerService } from './../libs/logger/logger.service';
import { User } from './../users/entities/user.entity';
import { SeePhotoOutput, SeePhotoInput } from './dtos/see-photo.dto';
import { PrismaService } from './../prisma/prisma.service';
import { UploadPhotoInput, UploadPhotoOutput } from './dtos/upload-photo.dto';
import { Injectable } from '@nestjs/common';
import { Hashtag } from 'src/hashtags/entities/hashtag.entity';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService, private readonly log: LoggerService) {}

  async user(id: number): Promise<User> {
    // ! 포토 유저 호출 성공
    this.log.logger().info(`${this.log.loggerInfo('포토 유저 호출 성공')}`);
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
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
    return hashtags;
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
          id: photo.id,
          file: photo.file,
          caption: photo.caption,
          hashtags: await this.hashtags(photo.id),
          user: await this.user(photo.userId),
          createdAt: photo.createdAt,
          updatedAt: photo.updatedAt,
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
}

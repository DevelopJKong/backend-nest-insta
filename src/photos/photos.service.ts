import { PrismaService } from './../prisma/prisma.service';
import { UploadPhotoInput, UploadPhotoOutput } from './dtos/upload-photo.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}
  async uploadPhoto(userId: number, { photoFile, caption }: UploadPhotoInput): Promise<UploadPhotoOutput> {
    try {
      let hashtagObj = [];

      if (caption) {
        const hashtags = caption.match(/#[\w]+/g);
        hashtagObj = hashtags.map(hashtag => ({ where: { hashtag }, create: { hashtag } }));
      }

      // ! parse caption
      // ! get or create Hashtag

      const { filename } = await photoFile;
      // ! save the photo WITH the parsed hashtags
      // ! add the photo the hashtags
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
      };
    } catch (error) {
      return {
        ok: false,
        error: new Error(error),
      };
    }
  }
}

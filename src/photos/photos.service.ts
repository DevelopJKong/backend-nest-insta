import { UploadPhotoInput, UploadPhotoOutput } from './dtos/upload-photo.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PhotosService {
  async uploadPhoto(userId: number, { photoFile, caption }: UploadPhotoInput): Promise<UploadPhotoOutput> {
    try {
      if (caption) {
        // ! parse caption
        // ! get or create Hashtag
      }

      // ! save the photo WITH the parsed hashtags
      // ! add the photo the hashtags

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'extraError',
      };
    }
  }
}

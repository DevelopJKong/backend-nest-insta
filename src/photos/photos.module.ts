import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { HashtagResolver, PhotosResolver } from './photos.resolver';

@Module({
  providers: [PhotosService, PhotosResolver, HashtagResolver],
})
export class PhotosModule {}

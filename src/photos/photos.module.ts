import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosResolver } from './photos.resolver';

@Module({
  providers: [PhotosService, PhotosResolver]
})
export class PhotosModule {}

import { Module } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { HashtagsResolver } from './hashtags.resolver';

@Module({
  providers: [HashtagsService, HashtagsResolver]
})
export class HashtagsModule {}

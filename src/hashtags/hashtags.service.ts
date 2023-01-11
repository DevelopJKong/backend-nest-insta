import { PrismaService } from 'src/prisma/prisma.service';
import { SeeHashTagOutput, SeeHashTagInput } from './dtos/see-hashtags.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashtagsService {
  constructor(private readonly prisma: PrismaService) {}
  async seeHashTag({ hashtag }: SeeHashTagInput): Promise<SeeHashTagOutput> {
    try {
      this.prisma.hashtag.findUnique({
        where: {
          hashtag,
        },
      });
      return {
        ok: true,
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

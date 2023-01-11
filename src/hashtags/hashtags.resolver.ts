import { SeeHashTagOutput, SeeHashTagInput } from './dtos/see-hashtags.dto';
import { Args, Resolver, Query } from '@nestjs/graphql';
import { RoleData } from '@prisma/client';
import { Role } from 'src/libs/auth/role.decorator';
import { HashtagsService } from './hashtags.service';

@Resolver()
export class HashtagsResolver {
  constructor(private readonly hashtagsService: HashtagsService) {}
  @Query(_return => SeeHashTagOutput)
  @Role([RoleData.USER])
  async seeHashTag(@Args('input') seeHashTagInput: SeeHashTagInput): Promise<SeeHashTagOutput> {
    return this.hashtagsService.seeHashTag(seeHashTagInput);
  }
}

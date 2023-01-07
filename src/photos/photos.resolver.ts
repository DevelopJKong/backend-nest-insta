import { SeePhotoOutput, SeePhotoInput } from './dtos/see-photo.dto';
import { RoleData } from '@prisma/client';
import { User } from './../users/entities/user.entity';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UploadPhotoOutput, UploadPhotoInput } from './dtos/upload-photo.dto';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';
import { PhotosService } from './photos.service';
import { Role } from 'src/libs/auth/role.decorator';
import { Photo } from './entities/photo.entity';
import { Hashtag } from 'src/hashtags/entities/hashtag.entity';

@Resolver(_of => Photo)
export class PhotosResolver {
  constructor(private readonly photosService: PhotosService) {}

  @Mutation(_return => UploadPhotoOutput)
  @Role([RoleData.USER])
  async uploadPhoto(
    @AuthUser() authUser: User,
    @Args('input') uploadPhotoInput: UploadPhotoInput,
  ): Promise<UploadPhotoOutput> {
    return this.photosService.uploadPhoto(authUser.id, uploadPhotoInput);
  }

  @Query(_return => SeePhotoOutput)
  @Role([RoleData.USER])
  async seePhoto(@Args('input') seePhotoInput: SeePhotoInput): Promise<SeePhotoOutput> {
    return this.photosService.seePhoto(seePhotoInput);
  }

  @ResolveField(_type => User)
  async user(@Parent() photo: Photo): Promise<User> {
    return this.photosService.user(photo.user.id);
  }
  @ResolveField(_type => [Hashtag])
  async hashtags(@Parent() photo: Photo): Promise<Hashtag[]> {
    return this.photosService.hashtags(photo.id);
  }
}

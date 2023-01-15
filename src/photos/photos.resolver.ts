import { SeeLikesOutput, SeeLikesInput } from './dtos/see-likes.dto';
import { SearchPhotosInput, SearchPhotosOutput } from './dtos/search-photos.dto';
import { ToggleLikeOutput, ToggleLikeInput } from './dtos/toggle-like.dto';
import { SeePhotoOutput, SeePhotoInput } from './dtos/see-photo.dto';
import { RoleData } from '@prisma/client';
import { User } from './../users/entities/user.entity';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UploadPhotoOutput, UploadPhotoInput } from './dtos/upload-photo.dto';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';
import { PhotosService } from './photos.service';
import { Role } from 'src/libs/auth/role.decorator';
import { Photo } from './entities/photo.entity';
import { Hashtag } from 'src/photos/entities/hashtag.entity';
import { SeeHashtagInput, SeeHashtagOutput } from './dtos/see-hashtags.dto';

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

  @Query(_return => SearchPhotosOutput)
  @Role([RoleData.USER])
  async searchPhotos(@Args('input') searchPhotosInput: SearchPhotosInput): Promise<SearchPhotosOutput> {
    return this.photosService.searchPhotos(searchPhotosInput);
  }

  @Query(_return => SeeLikesOutput)
  @Role([RoleData.USER])
  async seeLikes(@Args('input') { id }: SeeLikesInput): Promise<SeeLikesOutput> {
    return this.photosService.seeLikes(id);
  }

  @Mutation(_return => ToggleLikeOutput)
  @Role([RoleData.USER])
  async toggleLike(
    @AuthUser() authUser: User,
    @Args('input') toggleLikeInput: ToggleLikeInput,
  ): Promise<ToggleLikeOutput> {
    return this.photosService.toggleLike(toggleLikeInput, authUser.id);
  }

  @ResolveField(_type => User)
  async user(@Parent() photo: Photo): Promise<User> {
    return this.photosService.user(photo.user.id);
  }
  @ResolveField(_type => [Hashtag])
  async hashtags(@Parent() photo: Photo): Promise<Hashtag[]> {
    return this.photosService.hashtags(photo.id);
  }
  @ResolveField(_type => Number)
  async likes(@Parent() photo: Photo): Promise<number> {
    return this.photosService.likes(photo.id);
  }
}

@Resolver(_of => Hashtag)
export class HashtagResolver {
  constructor(private readonly photosService: PhotosService) {}

  @Query(_return => SeeHashtagOutput, { name: 'seeHashtag' })
  @Role([RoleData.USER])
  async seeHashTag(
    @Args('input') seeHashTagInput: SeeHashtagInput,
    @AuthUser() authUser: User,
  ): Promise<SeeHashtagOutput> {
    return this.photosService.seeHashtag(seeHashTagInput, authUser.id);
  }

  @ResolveField(_type => [Photo])
  async photos(
    @Parent() hashtag: Hashtag,
    @Args('page', { type: () => Number }) page: number,
    @AuthUser() authUser: User,
  ): Promise<Photo[]> {
    return this.photosService.photos(hashtag.id, page, authUser.id);
  }
  @ResolveField(_type => Number)
  async totalPhotos(@Parent() hashtag: Hashtag): Promise<number> {
    return this.photosService.totalPhotos(hashtag.id);
  }
}

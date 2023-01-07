import { RoleData } from '@prisma/client';
import { User } from './../users/entities/user.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UploadPhotoOutput, UploadPhotoInput } from './dtos/upload-photo.dto';
import { AuthUser } from 'src/libs/auth/auth-user.decorator';
import { PhotosService } from './photos.service';
import { Role } from 'src/libs/auth/role.decorator';

@Resolver()
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
}

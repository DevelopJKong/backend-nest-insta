import { CoreOutput } from './../../common/dtos/output.dto';
import { Photo } from 'src/photos/entities/photo.entity';
import { Field, PickType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { Comment } from 'src/comments/entities/comment.entity';
export class SeePhotoCommentsInput extends PickType(Photo, ['id']) {
  @Field(_type => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  page?: number;
}

export class SeePhotoCommentsOutput extends CoreOutput {
  @Field(_type => [Comment], { nullable: true })
  @IsOptional()
  comments?: Comment[];
}

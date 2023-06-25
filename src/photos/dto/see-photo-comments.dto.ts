import { CoreOutput } from '../../common/dto/output.dto';
import { Photo } from 'src/photos/entities/photo.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { Comment } from 'src/comments/entities/comment.entity';

@InputType()
export class SeePhotoCommentsInput extends PickType(Photo, ['id']) {
  @Field(_type => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  page?: number;
}

@ObjectType()
export class SeePhotoCommentsOutput extends CoreOutput {
  @Field(_type => [Comment], { nullable: true })
  @IsOptional()
  comments?: Comment[];
}

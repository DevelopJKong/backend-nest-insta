import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(_return => Number, { nullable: true })
  @IsNumber({}, { message: '팔로잉 횟수는 숫자여야 합니다.' })
  @IsOptional()
  totalFollowing?: number;

  @Field(_return => Number, { nullable: true })
  @IsNumber({}, { message: '팔로워 횟수는 숫자여야 합니다.' })
  @IsOptional()
  totalFollowers?: number;

  @Field(_return => Boolean, { nullable: true })
  @IsBoolean({ message: '팔로잉 여부는 불리언 값이어야 합니다.' })
  @IsOptional()
  isMe?: boolean;

  @Field(_return => Boolean, { nullable: true })
  @IsBoolean({ message: '팔로잉 여부는 불리언 값이어야 합니다.' })
  @IsOptional()
  isFollowing?: boolean;
}

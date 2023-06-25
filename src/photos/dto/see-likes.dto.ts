import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Photo } from '../entities/photo.entity';
import { User } from 'src/users/entities/user.entity';
import { IsOptional } from 'class-validator';

@InputType()
export class SeeLikesInput extends PickType(Photo, ['id']) {}

@ObjectType()
export class SeeLikesOutput extends CoreOutput {
  @Field(_type => [User], { nullable: true })
  @IsOptional()
  user?: User[];
}

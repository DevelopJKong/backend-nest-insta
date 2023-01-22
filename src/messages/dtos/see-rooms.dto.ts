import { Field, ObjectType } from '@nestjs/graphql';
import { Room } from '../entities/room.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsOptional } from 'class-validator';

@ObjectType()
export class SeeRoomsOutput extends CoreOutput {
  @Field(_type => [Room], { nullable: true })
  @IsOptional()
  rooms?: Room[];
}

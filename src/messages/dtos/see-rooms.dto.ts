import { Field, ObjectType } from '@nestjs/graphql';
import { Room } from '../entities/room.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@ObjectType()
export class SeeRoomsOutput extends CoreOutput {
  @Field(_type => [Room], { nullable: true })
  rooms?: Room[];
}

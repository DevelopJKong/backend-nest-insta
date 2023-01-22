import { Room } from './../entities/room.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class SeeRoomInput extends PickType(Room, ['id'] as const) {}
@ObjectType()
export class SeeRoomOutput extends CoreOutput {
  @Field(_type => Room, { nullable: true })
  @IsOptional()
  room?: Room;
}

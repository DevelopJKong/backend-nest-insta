import { Like } from '../entities/like.entity';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class ToggleLikeInput extends PickType(Like, ['id'] as const) {}

@ObjectType()
export class ToggleLikeOutput extends CoreOutput {}

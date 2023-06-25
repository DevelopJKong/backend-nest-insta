import { Message } from '../entities/message.entity';
import { CoreOutput } from '../../common/dto/output.dto';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class ReadMessageInput extends PickType(Message, ['id'] as const) {}

@ObjectType()
export class ReadMessageOutput extends CoreOutput {}

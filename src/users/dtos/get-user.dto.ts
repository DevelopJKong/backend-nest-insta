import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User as EntityUser } from "../entities/user.entity";
import { CoreOutput } from "../../common/dtos/output.dto";


@InputType()
export class GetUserInput extends PickType(EntityUser, ["id"]) {
}

@ObjectType()
export class GetUserOutput extends CoreOutput {
  @Field(() => EntityUser)
  user?: EntityUser;
}

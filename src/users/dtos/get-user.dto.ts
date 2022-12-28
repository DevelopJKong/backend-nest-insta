import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { CoreOutput } from "../../common/dtos/output.dto";


@InputType()
export class GetUserInput extends PickType(User, ["id"]) {
}

@ObjectType()
export class GetUserOutput extends CoreOutput {
  @Field((_returns) => User)
  user?: User;
}

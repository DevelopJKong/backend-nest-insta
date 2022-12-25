import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { CoreOutput } from "../../common/dtos/output.dto";

@InputType()
export class EditProfileInput extends PickType(User, ["email", "password", "firstName", "lastName"]) {

}

@ObjectType()
export class EditProfileOutput extends CoreOutput {

}
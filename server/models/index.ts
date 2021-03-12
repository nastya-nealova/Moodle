import { asValue } from "awilix";
import UserModel, { UserType } from "./UserModel";

export interface IModelContainer {
  UserModel: UserType;
}
export default {
  UserModel: asValue(UserModel)
};

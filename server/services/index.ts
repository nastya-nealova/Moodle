import { asClass } from "awilix";
import UserService from './UserService';

export interface IServiceContainer {
  UserService: UserService;
}
export default {
  UserService: asClass(UserService),
};

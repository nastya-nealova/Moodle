import BaseContext from "../BaseContext";
import IIdentity from "src/UserItem";

export default class UserService extends BaseContext {
  public findAllUsers() {
    try {
      const { UserModel } = this.di;
      return UserModel.find({});
    } catch (err) {
      console.error("Caught error", err);
    }
  }

  public findUserById(id) {
    try {
      const { UserModel } = this.di;
      return UserModel.findById(id).select(["_id", "role", "username", "firstName", "lastName"]);
    } catch (err) {
      console.error("Caught error", err);
    }
  }

  public async saveUserChanges(id: string, entity: IIdentity) {
    const { UserModel } = this.di;
    const user = await UserModel.findById(id);
    console.log("user 1: ", user);

    Object.keys(entity).forEach((key: any) => {
      user[key] = entity[key];
    });
    console.log("user 2: ", user);
    return user.save();
    // return UserModel.findByIdAndUpdate(
    //   { _id: id },
    //   {
    //     username: entity.username,
    //     firstName: entity.firstName,
    //     lastName: entity.lastName,
    //     password: entity.password,
    //   },
    //   { upsert: true }
    // ).then(() => UserModel.findById(id));
  }
  public async deleteUser(id: string) {
    try {
      const { UserModel } = this.di;
      // RecipesModel.updateMany(
      //   { ownerId: id },
      //   {
      //     ownerId: null,
      //   }
      // );
      return UserModel.findByIdAndDelete({ _id: id });
    } catch (err) {
      console.error("Caught error", err);
    }
  }
}

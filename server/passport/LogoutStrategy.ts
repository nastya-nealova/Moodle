import { Request } from "express";
import passportLocal from "passport-local";
import { UserType } from "../models/UserModel";
import BaseContext from "../BaseContext";
import { IContextContainer } from "../container";

interface ILoginStrategyOptions {
  UserModel: UserType;
}

export default class LogOutStrategy extends BaseContext {
  private strategyUser: passportLocal.Strategy;

  get strategy() {
    return this.strategyUser;
  }

  constructor(opts: IContextContainer) {
    super(opts);

    console.log("jwt: initialization Local-Logout strategy");
    this.verifyRequestUser = this.verifyRequestUser.bind(this);

    this.strategyUser = new passportLocal.Strategy(
      {
        // passwordField: 'password',
        passReqToCallback: true,
        usernameField: "username",
        session: false,
      },
      this.verifyRequestUser
    );
  }

  public async verifyRequestUser(req: Request, username: string, done: any) {
    // console.log("START LOGOUT");
    const { UserModel } = this.di;
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return done("Incorrect user!");
    }
    //user.save();
    const identity = {
      username: username,
    };
    return done(null, identity);
  }
}

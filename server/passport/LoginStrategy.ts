import { Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passportLocal from "passport-local";
import { UserType } from "../models/UserModel";
import BaseContext from "../BaseContext";
import  { IContextContainer } from "../container";
import * as config from "../../config";
/**
 * Return the Passport Local Strategy object.
 */

interface ILoginStrategyOptions {
  UserModel: UserType;
}

export default class LoginStrategy extends BaseContext {
  private strategyUser: passportLocal.Strategy;

  get strategy() {
    return this.strategyUser;
  }

  constructor(opts: IContextContainer) {
    super(opts);

    console.log("jwt: initialization Local-Login strategy");
    this.verifyRequestUser = this.verifyRequestUser.bind(this);

    this.strategyUser = new passportLocal.Strategy(
      {
        passwordField: "password",
        passReqToCallback: true,
        usernameField: "username",
        session: false,
      }, this.verifyRequestUser);
  }

  public async verifyRequestUser(req: Request, email: string, password: string, done: any) {
    // console.log("verifyRequestUser");
    const { UserModel } = this.di;
    const user = await UserModel.findOne({ username: email });
    // console.log("find user email", email);
    // console.log("find user ", user);
    if (!user) {
      return done("Incorrect password");
    }
    if (!user.password) {
      return done("You are not registered on the site");
    }

    let bcryptRes = await bcrypt.compare(password, user.password);
    if (!bcryptRes) {
      return done("Incorrect password");
    }

    const payload = {
      sub: user._id,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    user.token = token;
    user.save();

    // console.log("user to initSession ===>>>", user)
    const identity =this.di.initSession(req,user);
    return done(null, identity);
  }
}

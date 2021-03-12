import * as awilix from "awilix";
import { Request } from "express";
import coreConfig from "../config";
import modelContainer, { IModelContainer } from "./models";
import serviceContainer, { IServiceContainer } from "./services";
import passport, { PassportStatic } from "passport";
import SignUpStrategy from "./passport/SingUpStrategy";
import LoginStrategy from "./passport/LoginStrategy";
import JwtStrategy from "./passport/JwtStrategy";
import IIdentity from "src/UserItem";
import LogOutStrategy from "./passport/LogoutStrategy";

export interface IContextContainer extends IModelContainer, IServiceContainer {
  config: any;
  signUpStrategy: SignUpStrategy;
  loginStrategy: LoginStrategy;
  logoutStrategy: LogOutStrategy;
  jwtStrategy: JwtStrategy;
  passport: PassportStatic;
  initSession: (req: Request, user: any) => IIdentity;
}

export const passportFunc = (ctx: IContextContainer) => {
  passport.use("local-login", ctx.loginStrategy.strategy);
  passport.use("local-signup", ctx.signUpStrategy.strategy);
  passport.use("local-jwt", ctx.jwtStrategy.strategy);
  passport.use("local-logout", ctx.logoutStrategy.strategy);

  return passport;
};

export const initSession = (ctx: IContextContainer) => (
  req: Request,
  user: any
): IIdentity => {
   console.log("user =================>", user);

  const identity: IIdentity = {
    userId: user._id, //this._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    token: user.token,
    role: user.role,
    
  };

  req.session.updatedAt = Date.now();
  req.session.identity = identity;
  return identity;
};

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  ...modelContainer,
  ...serviceContainer,
  config: awilix.asValue(coreConfig),
  passport: awilix.asFunction(passportFunc).singleton(),
  initSession: awilix.asFunction(initSession).singleton(),
  signUpStrategy: awilix.asClass(SignUpStrategy).singleton(),
  loginStrategy: awilix.asClass(LoginStrategy).singleton(),
  logoutStrategy: awilix.asClass(LogOutStrategy).singleton(),

  jwtStrategy: awilix.asClass(JwtStrategy).singleton(),
});
export default container;

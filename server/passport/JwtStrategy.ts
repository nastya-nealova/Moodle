import { Request } from "express";
import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import * as config from "../../config";
import IIdentity from "..//../src/UserItem";

import BaseContext from "../BaseContext";
        //console.log("this_request" , this._request) 
import { IContextContainer } from "../container";

export default class JwtStrategy extends BaseContext {
  private _strategy: Strategy;
  private _request: Request;

  get strategy() {
    return this._strategy;
  }

  constructor(opts: IContextContainer) {
    super(opts);
    console.log("jwt: initialization JWT strategy");

    this.verifyRequest = this.verifyRequest.bind(this);
    this.getJwtFromRequest = this.getJwtFromRequest.bind(this);
     
    this._strategy = new Strategy(
      {
        jwtFromRequest: this.getJwtFromRequest,
        secretOrKey: config.jwtSecret,
      },
      this.verifyRequest
    );
  }

  public async verifyRequest(jwtPayload: any, done: VerifiedCallback) {

    if (this._request) {
      const identity: IIdentity = this._request.session.identity;
      const updatedAt = this._request.session.updatedAt;
      const isLogged = identity && identity.userId && identity.userId.toString() === jwtPayload.sub;

      if (isLogged) {
          return done(null, identity);
      } else {
          const sub = jwtPayload.sub;
          const { UserModel } = this.di;
          const user = await UserModel.findById(sub)
          if (user) {
           // console.log("this_request" , this._request)
            // console.log("user" , user)

              const identity = this.di.initSession(this._request, user);
              console.log("INITSESSION -------->" ,identity)
              return done(null, identity);
          } 
          return done('User was not found');
      }
  }
  return done('jwt error: request is empty');
}

public getJwtFromRequest(req: Request) {
  this._request = req;
  const getToken = ExtractJwt.fromAuthHeaderAsBearerToken();
  return  getToken(req) || req.cookies['token'] || null;
}

}

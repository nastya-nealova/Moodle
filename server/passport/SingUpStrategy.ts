import { Request } from "express";
import passportLocal from "passport-local";
import BaseContext from "../BaseContext";
import { IContextContainer } from "../container";
import { ROLE } from "../../src/commons";

declare global {
    namespace Express {
        interface Request {
            locale: any;
        }
    }
}

export default class SignUpStrategy extends BaseContext {
  private strategyUser: passportLocal.Strategy;

  get strategy() {
    return this.strategyUser;
  }

  constructor(opts: IContextContainer) {
    super(opts);

    console.log("jwt: initialization Local-SignUp strategy");
    this.verifyRequestUser = this.verifyRequestUser.bind(this);

    this.strategyUser = new passportLocal.Strategy(
      {
        passwordField: "password",
        passReqToCallback: true,
        usernameField: "username",
        session: false,
      },
      this.verifyRequestUser
    );
  }

  public async verifyRequestUser(
    req: Request,
    email: string,
    password: string,
    done: any
  ) {
    
    const { UserModel } = this.di;
    
    const u = await UserModel.findOne({ username: email });

    if (u) {
      return done({ username: "User already exists!" });
    }
    const defaultTimezone = "America/Edmonton";
    const { firstName, lastName, timezone, role } = req.body;
    // console.log("req.body.locale",req.body)
    let isRole: string = ROLE.USER;
    if (role) {
      isRole = role;
    }
    const userData = {
      role: isRole,
      username: email && email.trim().toLowerCase(),
      password: password && password.trim(),
      firstName: firstName && firstName.trim(),
      lastName: lastName && lastName.trim(),
      timezone: timezone ? timezone.trim() : defaultTimezone,
      // locale: req["locale"], // undefined
      locale:'en ',


    };

    const newUser = new UserModel(userData);
    // var error = BaseModel.validate(newUser);
    // if (error) {
    //     return done(error);
    // }
// console.log("newUser",newUser)
    newUser
      .save()
      .then((user: any) => {
        
        return done(null, {
          _id: user._id,
        });
      })
      .catch((error: any) => {
        return done(error);
      });
  }
}

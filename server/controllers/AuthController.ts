import { route, POST } from "awilix-express";
import { Request, Response, NextFunction } from "express";
import BaseContext from "../BaseContext";
import RegisterItem from "src/RegisterItem";
import IResponse from "src/Response";
import statuses from "../../src/errorsList";

@route("/api/auth")
export default class AuthController extends BaseContext {
  


  @POST()
  @route("/signUp")
  // @before([check('confirm')
  //         .custom((value, { req }) => {
  //             if (value !== req.body.password) {
  //                 throw new Error('Passwords don\'t match.');
  //             } else {
  //                 return value;
  //             }
  //         })
  //         .withMessage('Passwords don\'t match')
  //     ])
  public register(req: Request, res: Response, next: NextFunction) {
    const { passport } = this.di;
    return passport.authenticate("local-signup", (errors, identity) => {
      if (errors) {
        res.json(errors); 
      } else if (identity) {
        // res.json({
        //   error: false,
        //   data: identity,
        //   message: "You have successfully sign Up!",
        // }
        //   ); 
    return res.answer(identity, 'You have successfully sign Up!');

      } else {
        res.json(null);
      }
    })(req, res, next);
  }

  @POST()
  @route("/login")
  public login(req: Request, res: Response, next: NextFunction) {
    const { passport } = this.di;
    const JST_EXPIRE = 3;
    const REMEMBER_ME_EXPIRE = 30;
    return passport.authenticate( "local-login",(err, identity: RegisterItem) => {
         console.log("err", err);
         console.log("identity ", identity);
       
        if (err ) {
          // return res.json({
          //   data:null,
          //   message: err, 
          //   error:true
          // }); 

          // ------------------------------------------------------------------------------------- error must be real
    return res.answer(null, err, statuses.NOT_FOUND);

        }
        if (!identity ) {
          // return res.json({
          //   data:null,
          //   error: true,
          //   message: "Type your password!",
          // }); 
    return res.answer(null, err, statuses.UNAUTHORIZED);

        }
        let expire = JST_EXPIRE;
        if (req.body.rememberMe) {
          expire = REMEMBER_ME_EXPIRE;
        }

        res.cookie("token", identity.token, {
          maxAge: 1000 * 60 * 60 * 24 * expire,
        });
       

        //delete identity.token;

        //  res.json({
        //   error: false,
        //   data: identity,
        //   message: "You have successfully logged in!",
        // })
    return res.answer(identity, "You have successfully logged in!");

      }
    )(req, res, next);
  }



  @POST()
  @route("/logout")
  public logout(req: Request, res: Response, next: NextFunction) {
    const { passport } = this.di;
    // console.log('<---- LOG OUT ---->')
    return passport.authenticate('local-logout', (err, identity) => {
        // console.log('err ', err);
        // console.log('identity ', identity);
        if (err) {
            // const serRes = {
            //     error: true,
            //     data: null,
            //     message: err
            // } as IResponse;
            // res.json(serRes);
    return res.answer(null, err,statuses.NOT_FOUND);

        }
        // ----------->>> kostyli
        const result: boolean = false//identity === null || identity === false;
        if (!result) {
            for (let field in req.cookies) {
                res.clearCookie(field);
            }
            delete req.session;
          // console.log('session after clear ', req.session);
        }
        const message = !result ? 'Logged out successfully!' : 'Can\'t Log out !'; 
        const serRes = {
            error: result,
            data: identity,
            message: message
        } as IResponse;
        res.json(serRes);

    })(req, res, next);
  }


  @POST()
  @route("/findUser")
  public  findUser(req: Request, res: Response, next: NextFunction,done:any) {
    const { UserModel } = this.di;
    UserModel.findOne({ username: req.body.username },(err,user)=>{
      if(err)
      {
        // console.log("!!!!!!!!!!!!!!!!ERROR!!!!!!!!!")
      }else{
        res.json(user)
      }
    });
   
  }


}



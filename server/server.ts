import Express, { Request, Response, NextFunction } from "express";
import next from "next";
import bodyParser from "body-parser";
import config from "../config";
import models from "../MongoDB/mongoose";
import IIdentity from "./../src/UserItem";
import { loadControllers, scopePerRequest } from "awilix-express";
import container from "./container";
import cookieParser from "cookie-parser";
import { PassportStatic } from "passport";
import { ROLE } from "../src/commons";
import cookieSession from "cookie-session";
import statuses from "../src/errorsList";

export const IGNORS = [
  "/favicon.ico",
  "/_next",
  "/__nextjs_original-stack-frame",
  "/static",
  "/sitemap.xml",
  "/robots.txt",
  "/service-worker.js",
  "/manifest.json",
  "/styles.chunk.css.map",
  "/error",
];
models(config.mongo.uri, config.mongo.options);
const domain: string = config.baseUrl;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const passport = container.resolve<PassportStatic>("passport");
app.prepare().then(() => {
  const server: Express.Application = Express();
  server.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  server.use(cookieParser());
  server.use(
    cookieSession({
      name: "session",
      keys: [config.jwtSecret],
      maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days
    })
  );
  server.use(answer);
  function answer(req: Request, res: Response, next: NextFunction) {

    res.print = (
      pathName: string,
      ssrData: any
    ) => {
      req.ssrData = ssrData;
      //@ts-ignore
      return app.render(req, res, pathName, req.query)
    }

    res.answer = (
      data: any,
      message: any,
      status: number = statuses.OK,
    ) => {
      const result = {
        error: status > statuses.OK ? true : false,
        message: message,
        data: data
      }
      return res.json(result)

    }


    next();
  }

  server.use(bodyParser.json());
  server.use(scopePerRequest(container));

  const files = "controllers/**/*." + (config.dev ? "ts" : "js");
  server.use(loadControllers(files, { cwd: __dirname }));

  // Passport:

  server.use(passport.initialize());

  server.use(acl);

  server.all("*", (req: Express.Request, res: Express.Response) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
  });
});

function acl(req: Request, res: Response, next: NextFunction) {
  let useAcl = true;
  const path = req.path.toString();
  for (const item of IGNORS) {
    if (path.startsWith(item)) {
      useAcl = false;
    }
  }
  if (useAcl) {
    passport.authenticate("local-jwt", (err, identity: IIdentity) => {
      // console.log("IDENTITY strategy", identity)
      let isLogged = identity && identity.userId && identity.role !== ROLE.GUEST ? true : false;
      const resource = req.path.replace(/\./g, "_");
      if (!isLogged) {
        isLogged = ["/", "/register", "/login", "/api/findUser"].includes(resource);
      }
      console.log( "req.method=",req.method,"resource=",resource,"isAllowed?",isLogged );
      const userId = (identity && identity.userId) || null;
      if (!isLogged) {
        const isAPICall = resource.toLowerCase().includes("api");
        if (isAPICall) {
          return res.status(401).json({
            error: false,
            data: null,
            message: "You are not authorized to send this request!",
          });
        } else {
          return res.redirect("/error");
        }
      }
      next();
    })(req, res, next);
  } else {
    next();
  }
}

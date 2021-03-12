import { IContextContainer } from './container'

declare global {
  namespace Express {
      interface Response {
          answer: (data: any, message: any, status?: number) => void;
          // pager: (data: any, count: number, page: number,) => void;
          print: ( pathName: string, ssrData: any) => void;
      }

      interface Request {
        ssrData: any;
          // identityACL: IIdentityACL;
      }
  }
}

export default class BaseContext {
  protected di: IContextContainer;

  constructor (opts: IContextContainer) {
    this.di = opts
  }
}

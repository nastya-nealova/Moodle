import { DOMAIN, Method, CRUD, ENTITIES } from "../commons";
import fetch, { RequestInit } from "node-fetch";
import { normalize, schema } from "normalizr";
import { call, put, fork, take, select } from "redux-saga/effects";
import { camelizeKeys } from "humps";
import { IActionRequest, entityRequest, action } from "src/redux/actions";
import IResponse from "src/Response";

export const DELETE_SSRDATA = "DELETE_SSRDATA"
export const deleteSsrData = (entityName) => action(DELETE_SSRDATA, { entityName });

export const SHOW_TOAST = "SHOW_TOAST"
export const showToast = (toast) => action(SHOW_TOAST, { toast });

export const DELETE_NOTIFICATION = "DELETE_NOTIFICATION"
export const hideToast = () => action(DELETE_NOTIFICATION);


export function saga(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const entityName = target.constructor.name;
  const entityItem = Entity.mActions.hasOwnProperty(entityName) ? Entity.mActions[entityName] : {};
  if (!entityItem.hasOwnProperty(propertyKey)) {
    entityItem[propertyKey] = (data: any) => action(propertyKey, { data })
  }
  Entity.mActions[entityName] = entityItem;
}

export const watcher = (entity, functions) => {
  
  return (constructor: any) => {
    const entityActions = entity.actions;

    if (entityActions) {
      for (let entry of functions) {
        const entityItem = entityActions[entry]; // methods.hasOwnProperty(entry);
        if (entityItem) {
          const bound = entity[entry].bind(entity);
          const func = function* () {
            while (true) {
              const data = yield take(entry);
              console.log(`saga take ${entry} = `, data);
              delete data.type;
              yield call(bound, data);
            }
          }
          //  console.log("functions", func )
          Entity.addSaga(func);
        }
      }
    }
    // const entityName = entity.constructor.name;
    // const entityActions = Entity.mActions[entityName];

    // if(entityActions){
    //   for (let entry of functions) {
    //     console.log("ENTRY", entry);

    //     const entityItem = entityActions[entry]; // methods.hasOwnProperty(entry);
    //     if (entityItem) {
    //       const bound = entity[entry].bind(entity);

    //       // const genFunc = methods[entry];
    //       // console.log("genFunc", genFunc)
    //       const func = function* () {
    //         while (true) {
    //           const data = yield take(entry);
    //           console.log(`saga take ${entry} = `, data);
    //           delete data.type;
    //           yield call(bound, data);
    //         }
    //       }
    //       Entity.addSaga(func);
    //     }
    //   }
    // }




    // const methods = entity.actions;
    // console.log("METHODS --- ", methods)
    // console.log("functions --- ", functions)
    // for (let entry of functions) {
    //   console.log("ENTRY", entry);
    //   const entityItem = methods.hasOwnProperty(entry);
    //   if (entityItem) {
    //     const genFunc = methods[entry];
    //     console.log("genFunc", genFunc)
    //     const bound = genFunc.bind(entity);
    //     const func = function* () {
    //       while (true) {
    //         const data = yield take(entry);
    //         console.log(`saga take ${entry} = `, data);
    //         delete data.type;
    //         yield call(bound, data);
    //       }
    //     }
    //     Entity.addSaga(func);
    //   }
    // }
  }
}


export interface IEntityRequest { }
export default class Entity {
  protected mEntityName: string;
  public static mSagas: any[] = [];
  public static mActions: any[] = [];
  public static context: any;

  public mSchema: any;
  constructor(name: string = ENTITIES.ENTITY, definitions: any = {}, options: any = {}) {
    this.mEntityName = name;
    this.mSchema = name !== ENTITIES.ENTITY ? [new schema.Entity(name, definitions, options)] : null;
    this.xRead = this.xRead.bind(this);
    this.xDelete = this.xDelete.bind(this);
    this.xSave = this.xSave.bind(this);

  }

  public get entityName() {
    return this.mEntityName;
  }

  public static get saga() {
    return Entity.mSagas;
  }

  public static get getContext() {
    return Entity.context;
  }
  public get actions() {
    const entityName = this.constructor.name;
    return Entity.mActions[entityName];
  }

  public static addSaga(...args: any[]) {
    args.forEach((item) => {
      if (item instanceof Function) {
        Entity.mSagas.push(fork(item));
      }
    });
  }

  public xFetch = (url: string, data: Object, method: Method) => {
    const path = DOMAIN + "/api" + url;
    const request: RequestInit = {};

    request.method = method;
    request.headers = {
      "Content-Type": "application/json",
    };
    if (method === Method.GET) {
      const urlParameters = Object.entries(data)
        .map((e) => e.join("="))
        .join("&");
    } else {
      request.body = JSON.stringify(data);
    }
    console.log("data in xFetch", request.body);

    return fetch(path, request).then((res) => {
      return res.json();
    });
  };

  private getAction(crud: any = null): IActionRequest {
    let action: IActionRequest = entityRequest(this)[CRUD.READ];

    switch (crud) {
      case CRUD.CREATE:
        action = entityRequest(this)[CRUD.CREATE];
        break;
      case CRUD.UPDATE:
        action = entityRequest(this)[CRUD.UPDATE];
        break;
      case CRUD.DELETE:
        action = entityRequest(this)[CRUD.DELETE];
        break;
      default:
      case CRUD.READ:
        break;
    }
    return action;
  }

  protected *actionRequest(
    url: string,
    crud: CRUD,
    method: Method,
    data?: any
  ) {
    const action: IActionRequest = this.getAction(crud);
    let result;
    if (Entity.context?.isServer) {
      const ssrData = yield select((state: any) => state.ssrData[this.mEntityName]);
      yield put(deleteSsrData(this.mEntityName))
      // const dataString = JSON.stringify(ssrData);
      // const parsed = JSON.parse(dataString);
      result = {
        data:  JSON.parse(JSON.stringify(ssrData)),
        error: false,
        message: "Get SSR Data"
      }
      console.log("action request => isServer - ssrData", result)
    } else {
      result = yield call(this.xFetch, url, data, method);
      console.log("action request => xFetch - result", result)

    }
    const success = !result.error;
    const query = result.data;
    yield put(showToast({message:result.message, error:result.error}))
    // console.log("-------------- SHOW TOAST --------------", test)
    // const typeOfDialog = result.typeOfDialog;
    let response;
    if (success && this.mSchema && query) {
      response = normalize(camelizeKeys(query), this.mSchema);
    } else if (query) {
      response = query;
    }
    if (success) {
      yield put(action.success(data, response));
    } else {
      yield put(action.failure(data, response));
    }
  }

  public xRead = (url: string, data: Object, method = Method.GET) => {
    return this.actionRequest(url, CRUD.READ, method, data);
  };
  public xDelete = (url: string, data: Object) => {
    return this.actionRequest(url, CRUD.DELETE, Method.DELETE, data);
  };
  public xSave = (url: string, data: Object) => {
    return this.actionRequest(url, CRUD.UPDATE, Method.POST, data);
  };
}



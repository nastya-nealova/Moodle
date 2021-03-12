import Entity, { saga } from "./Entity";
import {  action } from "../redux/actions";
import { take, call, select } from "redux-saga/effects";
import { ENTITIES } from "src/commons";

// export const EDIT_USER_REQUEST = "EDIT_USER_REQUEST";

// export const editUserRequest = (id) => action(EDIT_USER_REQUEST, { id });

class UsersEntity extends Entity {
  constructor() {
    super(ENTITIES.USERS);
  }

  @saga
  public* saveUserChanges(data) {
   console.log("saga take SAVE_USERS_CHANGES_REQUEST = ", data);
      const url = "/users/save";
      const result = yield call(this.xSave, url, data.data);
      console.log("fetch() saga call = ", result);
  }

  @saga
  public *getUsers() {
      // const data = yield select((state: any) => state.entities?.get("users"));
      // if (!data) {
        const url = "/users/getUsers";
        const result = yield call(this.xRead, url, {});
        console.log("fetch() saga call = ", result);
      // }
  }

  @saga
  public *deleteUser(takeData) {
      const url = "/users/remove";
      const result = yield call(this.xDelete, url, { item: takeData.data });
      console.log("fetch() saga call = ", result);
  }

  @saga
  public *editUser(data)
  {
    console.log("Data in edit--------- ", data)
    const id = data.data;
    const url = "/users/" + id;
    const result = yield call(this.xRead, url, {id});
    console.log("fetch() saga call editUser = ", result);
  } 
}

export default new UsersEntity();

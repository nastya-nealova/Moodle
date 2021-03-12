import {  Method } from "../commons";
import { take, call, put } from "redux-saga/effects";
import {  action } from "src/redux/actions";
import Entity, { saga, showToast } from "src/entities/Entity";
import Router from "next/router";

export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGOUT_SUCCESS = "USER_LOGOUT_SUCCESS";
export const USER_SIGNUP_SUCCESS = "USER_SIGNUP_SUCCESS";
export const SET_IDENTITY = "SET_IDENTITY"

export const saveUserSuccess = (user) =>action (USER_LOGIN_SUCCESS, {user});
export const logOutUserSuccess = () => action(USER_LOGOUT_SUCCESS);
export const saveUserToDBSuccess = (user) => action(USER_SIGNUP_SUCCESS, { user });
export const setIdentity = (user) => action(SET_IDENTITY, { user });


export class Identity extends Entity {
  constructor() {
    super();
  }

  @saga
  public *userLogin(data) {
    console.log("data in userLogin", data)
    const url = "/auth/login";
    const result = yield call(this.xFetch, url, data.data, Method.POST);
    const response = result.data;
    console.log("fetch() saga call = ", result);
    if (!response) {
      console.log("LOGIN ERROR ===>>>", result.message);
      // yield put(showToast({ message: result.message, error: result.error }))
      alert(`LOGIN ERROR ===>>> ${result.message}`);
    } else {
      console.log(result.message);
      yield put(saveUserSuccess(response));
      Router.push("/");
    }
  }

  @saga
  public* userLogout(data) {
      const url = "/auth/logout";
      const result = yield call(this.xFetch, url, { username: data.user}, Method.POST );
      console.log("fetch() saga call = log out response : ", result);
      if (!result.error) {
        yield put(logOutUserSuccess());
        Router.push("/");
      } else {
        alert(result.message);
      }
  }

  @saga
  public* userSignup(data) {
      const url = "/auth/signUp";
      const result = yield call(this.xFetch, url, data.data,Method.POST);
      console.log("fetch() saga call = ", result);
      if (!result) {
        console.log("SIGN UP ERROR !!!");
      } else {
        yield put(saveUserToDBSuccess(result.data));
        Router.push("/login");
      }
  }
}

export enum IDENTITY {
  IDENTITY="identity",
  USER="user"
}

export default new Identity();

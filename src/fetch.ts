import { DOMAIN, Method } from "./commons";
import fetch, { RequestInit } from "node-fetch";

export const xFetch = (url: string, data: Object, method: Method) => {
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
    // console.log('  request.body: ',  request.body)
  }

  return fetch(path, request).then((res) => {
    return res.json();
  });
};

export const xRead = (url: string, data: Object, method = Method.GET) => {
  return xFetch(url, data, method);
};
export const xDelete = (url: string, data: Object) => {
  return xFetch(url, data, Method.DELETE);
};
export const xSave = (url: string, data: Object) => {
  // console.log(' data: ', data)
  return xFetch(url, data, Method.POST);
};

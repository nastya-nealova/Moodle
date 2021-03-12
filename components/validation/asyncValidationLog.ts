import { xRead } from "src/fetch";
import { Method } from "src/commons";



export const asyncValidate = (values /*, dispatch*/) => {
  return xRead(
    "/auth/findUser",
    { username: values.username },
    Method.POST
  ).then((res) => {
    // console.log("res");

    if (!res) {
      throw { username: "Username doesn\'t exist" };
    }
  });
}
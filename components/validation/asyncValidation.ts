import { xRead } from 'src/fetch'
import { Method } from 'src/commons'

export const asyncValidate = (values, form /*, dispatch */) => {
  console.log('form', form)
  return xRead(
    '/auth/findUser',
    { username: values.username },
    Method.POST
  ).then((res) => {
    if (res) {
      throw { username: 'Username is taken' }
    }
    // else{
    //   throw { username: "Username doesn\'t exist" };
    // }
  })
}

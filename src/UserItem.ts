export default interface IIdentity {
  userId?: string;
  role?: string;
  password?:string;
  username: string;
  firstName: string;
  lastName: string;
  token?: string;
}

import mongoose from "mongoose";
import {
  pre,
  prop,
  modelOptions,
  getModelForClass,
  DocumentType,
} from "@typegoose/typegoose";
import BaseContext from "../BaseContext";
// import { type } from "os";
import bCrypt from "bcrypt";

@pre<UserSchema>("save", function (next) {
  if (this.isNew) {
    this.createdAt = Date.now();
  }
  this.updatedAt = Date.now();

  //!!! the following lines of the code have to be last in the SAVE callback
  //!!! --------------------------------------------------------------------
  if (!this.isModified("password")) {
    return next();
  }

  bCrypt.hash(this.password, 10, (hashError: Error, encrypted: string) => {
    if (hashError) {
      return next(hashError);
    }

    // replace a password string with hash value
    this.password = encrypted;

    return next();
  });
  //!!! --------------------------------------------------------------------
})
@modelOptions({ schemaOptions: { collection: "users" } })
export class UserSchema extends BaseContext {
public _id = mongoose.Schema.Types.ObjectId

  @prop({ type: String, required: true })
  public role: string;

  @prop({ unique: true, required: true })
  public username: string;

  @prop({ type: String, required: true })
  public firstName: string;

  @prop({ type: String, required: true })
  public lastName: string;

  @prop({ type: String, required: true })
  public password: string;

  @prop()
  public lastAction: number;

  @prop()
  public createdAt: number;

  @prop({ type: Number })
  public updatedAt: number;

  @prop({ type: String, required: true })
  public timezone: string;

  @prop({ type: String, required: true })
  public locale: string;

  @prop({ type: String })
  public token: string;
}
export type UserType = mongoose.Model<DocumentType<UserSchema>, {}> &
  UserSchema;
export default getModelForClass(UserSchema);

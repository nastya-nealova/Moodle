import { route, GET, POST, DELETE } from "awilix-express";
import { Request, Response } from "express";
import BaseContext from "../BaseContext";
import { CREATE_ENTITY_URL } from "../../src/commons";
import IResponse from "src/Response";
import IIdentity from 'src/UserItem';

@route("/api/users")
export class UserController extends BaseContext {


  @GET()
  @route("/getUsers")
  public async getAllUsers(req: Request, res: Response) {
    const { UserService } = this.di;
    const items = await UserService.findAllUsers();
    return res.answer(items, 'Get all users');
  }

  @GET()
  @route("/:id")
  public async getUserById(req: Request, res: Response) {
    const { UserService } = this.di;
    console.log("body",req.body)
    const id = req.params.id; 
    console.log("REQ>BODY-----------", id)
    const items = await UserService.findUserById(id);
    return res.answer(items, 'Get  user by id');
  }
 
  @POST()
  @route("/save")
  public SaveUser(req: Request, res: Response) {
    const { UserService } = this.di;
    const id = req.body.id; // correct
    console.log("req body in save url==========>>>",req.body)
    console.log("ID in save url==========>>>",id)
    let entity:IIdentity = {
      username:req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    if(req.body.newPassword){
      entity.password = req.body.newPassword;
    }     
    console.log("entity==========>>>",entity)

    if (id) {
      return UserService.saveUserChanges(id, entity).then((content) => {
        console.log("content witch returned by saveChanges",content)
    return res.answer([content], 'Save user changes');

      });
    } 
  }


  @DELETE()
  @route("/remove")
  public async DeleteUser(req: Request, res: Response) {
    const { UserService } = this.di;
    const id =req.body.item.id;
    const content = await UserService.deleteUser(id);
    // console.log("DELETE mas", content)
    // const result: IResponse = {
    //   data: content,
    //   error: false,
    //   message: 'Successfully delete user',
    // }
    // return res.json(result);
    return res.answer(content, 'Successfully delete user');


    // return RecipeService.deleteRecipe(id).then((content) => {
    //   return res.json({ data: content });
    // });
  }
}

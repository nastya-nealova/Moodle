import { route, GET } from "awilix-express";
import { Request, Response, NextFunction } from "express";
import BaseContext from "../BaseContext";
import { ENTITIES, CREATE_ENTITY_URL } from "../../src/commons";

@route("/")
export default class RenderController extends BaseContext {


   



    @GET()
    @route("users/")
    public async getAllUsers(req: Request, res: Response) {
        const { UserService } = this.di;
        const items = await UserService.findAllUsers().lean();
        const result = {
            [ENTITIES.USERS]: items,

        }
        console.log("ITEMS IN RENDER CONTROLLER", items)
        return res.print('/users', result);

    }

    @GET()
    @route("user/:id")
    public async getUserByID(req: Request, res: Response) {
        console.log("------------------------ RENDER route = `/api/user/:id` ------------------------")
        const { UserService } = this.di;
        const id = req.params.id;
        if (id !== CREATE_ENTITY_URL) {
            const items = await UserService.findUserById(id).lean();
            const result = {
                [ENTITIES.USERS]: [items],
            }
            // console.log("ITEMS IN RENDER CONTROLLER", items)
            return res.print('/user/:id', result);
        }
    }
}



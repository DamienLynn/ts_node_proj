import { controller, queryParam, response, httpGet } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../domian/constant/types";
import { inject } from "inversify";
import { IUser } from "../models/interfaces/user.interfact";
import { Get, Route } from "tsoa";
import UserService,{ IUserService } from "../services/user.service";

@controller("/users")
@Route("ping")
export class UserController {
    @inject(TYPES.Service.User)
    private userService: IUserService = new UserService(); 

    /**
     *  Get all
     * 
     *  @return
     */
    @Get("/")
    @httpGet("/")
    public async getAll(
        @response() res: express.Response,
        @queryParam("filter") filter: IUser
    ) {
        try{

            const user = await this.userService.getUsers();
            res.status(200)
            res.json({
                code: 200,
                message: "success",
                data: user
            });

        } catch(err){
            res.status(500)
            res.json(err)
        }
    }
}
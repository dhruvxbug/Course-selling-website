import type { NextFunction } from "express";

require("dotenv").config();
import jwt, {JwtPayload} from "../config.ts";

function UserMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers.token;
        console.log(token);
        const userDetails = jwt.verify(token, process.env.JWT_USER_SECRET);
        if(userDetails){
            req.userId = userDetails.id;
            next();
        }else{
            res.staus(401)({
                message: "Unauthorized"
            })
        }
        console.log(userDetails.userId);
}

module.exports = {
    UserMiddleware: UserMiddleware 
}
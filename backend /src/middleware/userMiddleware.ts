import type {   Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
require("dotenv").config();
import {jwt, JWT_USER_SECRET} from "../config.js";

declare global{
    namespace Express{
        interface Request{ 
            userId: string;
            adminId: string;
        }
    }
}

function UserMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers.token;
        console.log(token);

    if (!token || typeof token !== "string") {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

        const userDetails = jwt.verify(token as string, process.env.JWT_USER_SECRET as string) as string | JwtPayload;
        if(typeof userDetails=== 'object'){
            req.userId = userDetails.id;
            next();
        }else{
            res.status(401).json({
                message: "Unauthorized"
            })
        }
}

export{ UserMiddleware}

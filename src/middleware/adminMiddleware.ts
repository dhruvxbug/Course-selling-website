require("dotenv").config();
import type { Request, Response, NextFunction} from "express";
import {jwt }from "../config.js";

interface JwtPayloadType{
    id: string
}
 
function AdminMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers.token;
        console.log(token);
        const adminDetails = jwt.verify(token as string, process.env.JWT_ADMIN_SECRET as string) as JwtPayloadType;
        if(adminDetails){
            req.adminId = adminDetails.id;
            next();
        }else{
            res.status(401).json({
                message: "Unauthorized"
            })
        }
        console.log(adminDetails.id);
}

export{
    AdminMiddleware
}
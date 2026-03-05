import {Router} from "express"
import  type { Request,Response } from "express";
import { CourseModel,PurchaseModel } from "../db.js";
import { UserMiddleware } from "../middleware/userMiddleware.js";

const CourseRouter = Router();


CourseRouter.post("/purchase",UserMiddleware, async function(req: Request,res: Response){
    const userId = req.userId;
    const {courseId} = req.body;

    //razorpay functionality should be added to make sure that a purchase has been made 

    await PurchaseModel.create({
        UserId: userId,
        CourseId: courseId
    })
    res.json({
        message: "course purchased"
    })
})

CourseRouter.get("/preview", async function(req: Request,res: Response){
    const courses = await CourseModel.find({});
    res.json({
        courses
    })
})

export{ CourseRouter }
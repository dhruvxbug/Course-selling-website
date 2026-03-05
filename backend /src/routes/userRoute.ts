import type {Request, Response } from "express"
import {Router } from "express"
const UserRouter = Router();
import {UserModel,CourseModel, PurchaseModel} from "../db.js"
import  {jwt,z,bcrypt} from "../config.js";
import {UserMiddleware} from "../middleware/userMiddleware.js";
require("dotenv").config();

declare global{
    namespace Express{
        interface Request{ 
            userId: string;
            adminId: string;
        }
    }
}

UserRouter.post("/signup",async function(req: Request,res: Response){
     try{
    const requiredbody = z.object ({
        email : z.string().min(3).max(40).email(),
        password: z.string().min(8,"Password must be at least 8 characters").max(40, "Password can't exceed 40 characters").regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,"Password must contain at least one letter and one number and one special character"),
        Firstname: z.string().min(3).max(40),
        Lastname: z.string().min(3).max(40)
    })

    const parsedData = requiredbody.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            message: "Invalid format",
            error: parsedData.error
        })
    }

    const email  = req.body.email;
    const password = req.body.password;
    const Firstname = req.body.Firstname;
    const Lastname = req.body.Lastname
   
    const hashedpassword = await bcrypt.hash(password, 5);
    await UserModel.create({
        Email : email,
        Password: hashedpassword,
        FirstName: Firstname,
        LastName: Lastname
    })
    res.json({
        message:"user created"
    })
    }catch(e){
        if(e instanceof Error){
        res.status(500).json({ 
            error: e.message
        });
       } else {
        res.status(500).json({
            error: String(e)
        });
       }
    }
});

UserRouter.post("/signin", async function(req,res){
   try{
    const email = req.body.email;
    const password = req.body.password;
    
    const user = await UserModel.findOne({
         Email : email
    });

    if(!user){
        return res.json({
            message:"This user doesn't exist"
        })
    }
    
    const match = await bcrypt.compare(password, user.Password as string);
    if(match){
        const token = jwt.sign({id: user._id}, process.env.JWT_USER_SECRET as string);
        console.log(jwt);
        res.json({
            token: token
        })
    }else {
        res.status(403).json({
            message: "error in generating token"
        })
    }
   } catch(e){
       if(e instanceof Error){
        res.status(500).json({ 
            message: "Unauthorized",
            error: e.message
        });
       } else {
        res.status(500).json({
            message: "Unauthorized",
            error: String(e)
        });
       }
   }
});

UserRouter.get("/purchases",UserMiddleware,  async function(req: Request,res: Response){
    const userId = req.userId;

    const purchases = await PurchaseModel.find({
        UserId: userId
    })
    const courses = await CourseModel.find({
        _id: {$in: purchases.map(x=>x.CourseId)}
    })
    res.json({
        purchases,
        courses
    })
});


export{ UserRouter }
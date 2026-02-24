const {Router} = require("express");
const AdminRouter = Router();
const {AdminModel, CourseModel} = require("../../db.js")
const {jwt,z,bcrypt} = require("../config.js");
const {AdminMiddleware} = require("../middleware/admin")


AdminRouter.post("/signup", async function (req,res){
    try{
        const requiredbody = z.object ({
        email : z.string().min(3).max(40).email(),
        password: z.string().min(8,"Password must be at least 8 characters").max(40, "Password can't exceed 40 characters").regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,"Password must contain at least one letter and one number and one special character"),
        Firstname: z.string().min(3).max(40),
        Lastname: z.string().min(3).max(40)
    })

    const parsedData = requiredbody.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            message: "Invalid format ",
            error: parsedData.error
        })
        return
    }

    const email = req.body.email;
    const password = req.body.password;
    const Firstname = req.body.Firstname;
    const Lastname = req.body.Lastname
    const hashedpassword = await  bcrypt.hash(password, 5);
    await AdminModel.create({
        Email : email,
        Password: hashedpassword,
        FirstName: Firstname,
        LastName: Lastname
    })
      res.json({
        message: "Admin sign up successful"
       })
    }catch(e){
        res.status(401).json({
            message: "Unauthorized",
        error: e.message
        })
    }
})

AdminRouter.post("/signin", async function(req,res){
    try{
    const email = req.body.email;
    const password = req.body.password;
    
    const admin = await AdminModel.findOne({
         Email : email
    });

    if(!admin){
        res.json({
            message:"This user doesn't exist"
        })
    }
    
    const match = await bcrypt.compare(password, admin.Password);
    if(match){
        const token = jwt.sign({id: admin._id}, process.env.JWT_ADMIN_SECRET);
        res.json({
            token: token
        })
    }else {
        res.status(403).json({
            message: "Uunauthorized"
        })
    }
    }catch(e){
        res.status(401).json({
            message: "Unauthorized",
            error: e.message
        })
    }
})

AdminRouter.post("/course", AdminMiddleware,async function(req,res){
    const adminId = req.adminId;

    const {title,description,price,Imgurl} = req.body;
    const course = await CourseModel.create({
        Title: title,
        Description: description,
        Price: price,
        ImgUrl: Imgurl,
        AdminId: adminId
    })
     res.json({
        message:"Course created",
        CourseId: course._id
     })
})

AdminRouter.put("/course", AdminMiddleware, async function(req, res){
     const adminId = req.adminId;

     const {title,description,price,Imgurl, courseId} = req.body;
     const course = await CourseModel.updateOne({ 
        _id: courseId,
        AdminId: adminId
    },{
        Title: title,
        Description: description,
        Price: price,
        ImgUrl: Imgurl
     })
     res.json({
        message: "Course Details updated",
        CourseId: course._id
     })
})

AdminRouter.get("/course/bulk",AdminMiddleware, async function(req, res){
     const adminid = req.adminId;

     const courses = await CourseModel.find({AdminId: adminId});
     res.json({
         message: "courses found",
         courses
     })

})

module.exports={
    AdminRouter: AdminRouter
}

import express = require("express");
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
require("dotenv").config();
import "dotenv/config"

import {UserRouter}  from "./routes/userRoute.js";
import {CourseRouter} from "./routes/courseRoute.js";
import {AdminRouter}  from "./routes/adminRoute.js";

const app = express();
app.use(express.json({limit: "200kb", strict: true}));

app.use("/user", UserRouter); 
app.use("/admin", AdminRouter);
app.use("/course",CourseRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL as string);
    app.listen(3000); 
}

main();
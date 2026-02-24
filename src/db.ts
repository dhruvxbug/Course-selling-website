import mongoose, {Schema, model} from "mongoose";

const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    Email: {type: String, unique: true, required: true},
    FirstName: String,
    LastName: String,
    Password: String
});

const AdminSchema = new Schema({
    Email: {type: String, unique: true},
    FirstName: String,
    LastName: String,
    Password: String
});

const CourseSchema = new Schema({
    Title: String,
    Description: String,
    Price: Number,
    ImgUrl: String,
    AdminId: ObjectId
});

const PurchaseSchema = new Schema({
    UserId: ObjectId,
    CourseId: ObjectId
})

const UserModel = model("user", UserSchema);
const AdminModel = model("admin", AdminSchema);
const CourseModel = model("course", CourseSchema);
const PurchaseModel = model("purchase", PurchaseSchema);

module.exports = {
   UserModel,
   AdminModel,
   CourseModel,
   PurchaseModel   
}
import mongoose, { Schema, model} from "mongoose";

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
    AdminId: {type: Schema.Types.ObjectId, ref: 'admin', required: true}
});

const PurchaseSchema = new Schema({
    UserId: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    CourseId: {type: Schema.Types.ObjectId, ref: 'course', required: true}
})

export const UserModel = model("user", UserSchema);
export const AdminModel = model("admin", AdminSchema);
export const CourseModel = model("course", CourseSchema);
export const PurchaseModel = model("purchase", PurchaseSchema);

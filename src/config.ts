import jwt = require("jsonwebtoken");
import bcrypt = require("bcrypt");
import z = require("zod");

export const JWT_USER_SECRET : string | undefined = process.env.JWT_USER_SECRET;
export const JWT_ADMIN_SECRET : string | undefined = process.env.JWT_ADMIN_SECRET;
export const MONGO_URL : string | undefined = process.env.MONGO_URL;
export { jwt, bcrypt, z};
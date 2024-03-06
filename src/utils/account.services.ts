import bcrypt from "bcrypt";
import mongoose, { ConnectOptions } from "mongoose";
import Specialists from "../database/schemas/user";
import db from "../database/db";
import { error } from "console";
import user from "../database/schemas/user";
import jwt from "jsonwebtoken"
import Users from "../database/schemas/user"

export const hashPassowrd = async (password: string): Promise<string> => {
  const saltRounds = 10;
  if (!password) {
    throw new Error("Password unable to be stored");
  }
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};
export const dobValidator = (dateOfBirth: string): boolean => {
  const dateOfBirthRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dateOfBirth.match(dateOfBirthRegex)) {
    return false;
  }
  return true;
};
/**
 * 
 * @param email This is the email that will be validated
 * @returns True if the email is formatted correctly otherwise false
 */
export const emailValidator = (email: string): boolean => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
};

/**
 * 
 * @param email This email is used to identify an individual in the database
 * @returns JWT token for authentication
 */
export const generateToken = async (email: string): Promise<string> => {
    const user = await db.get(Users, {email: email}, "type" );
    if(!user){
        throw new Error("Unable to generate token")
    }
    const payload = {
        sub: user._id.toString(),
        username: email,
        role: user.type,
        iat: Math.floor(Date.now() / 1000)
    }
    const token = jwt.sign(payload, process.env.SECRET!, {expiresIn: '2m'})
    return token
}
//TODO
//const verifyToken = 

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  if (!password || !hashedPassword) {
    throw new Error("verifyPassword is missing parameters");
  }
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result
  } catch (err: any) {
    console.error(err.message);
    return false
  }
};
// export const  loginVerification = (email: string, password: string): boolean => {
//
// const standardLoginError = "Invalid email or password"
//
// if (!email || !password) {
// throw new Error(standardLoginError)
// }
// await emailValidator(email);
//
// const user = await db.getUser(email).select;
//
// if (!isUser ){
// throw new  Error(standardLoginError)
// }
// user._doc
//
// return true
// }

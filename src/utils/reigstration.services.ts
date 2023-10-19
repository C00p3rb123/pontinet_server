import bcrypt from "bcrypt"
import mongoose, { ConnectOptions } from "mongoose";
import Specialists from "../database/schemas/user";
import db from "../database/db";

export const hashPassowrd = async (password: string): Promise<string> => {
    const saltRounds = 10;
    if (!password) {
       throw new Error("Password unable to be stored");
    }
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}
export const dobValidator = (dateOfBirth: string): boolean => {
    const dateOfBirthRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateOfBirth.match(dateOfBirthRegex)) {
    return false
}
    return true
}


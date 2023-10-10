import bcrypt from "bcrypt"
import mongoose, { ConnectOptions } from "mongoose";
import Specialists from "../database/schemas/sp";
import db from "../database/db";

export const storeUser = async (email: string, password: string, mobile: number) => {
    try {
        db.on("error", (error) => console.log(error.message))
        const user = await Specialists.create({ email: email, password: password, mobile: mobile });
    } catch (err: any) {
        console.log(err.message);
    }
}

export const hashPassowrd = async (password: string): Promise<string> => {
    const saltRounds = 10;
    if (!password) {
       throw new Error("Password unable to be stored");
    }
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}


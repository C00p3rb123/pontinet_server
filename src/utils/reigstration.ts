import bcrypt from "bcrypt"
import mongoose, { ConnectOptions } from "mongoose";
import Specialists from "../schemas/sp";

export const storeUser = async (email: string, password: string, mobile: number) => {
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/PontinetDB");
        const db = mongoose.connection;
        db.on("error", (error) => console.log(error.message))
        const user = await Specialists.create({ email: "dev", password: "sdfsdf", mobile: 0o40000000000 });
        console.log(`${user}`)
        db.close();
    } catch (err: any) {
        console.log(err.message);
    }


}

export const hashPassowrd = (password: string) => {
    const saltRounds = 10;
    if (!password) {
        console.error("Password undefined")
        return;
    }

    const hash = bcrypt.hash(password, saltRounds);
    return hash;
}


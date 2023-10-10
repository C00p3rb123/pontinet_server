import mongoose, { ConnectOptions } from "mongoose";
import Specialists from "../schemas/sp";


export const checkForUsers = async (email: string, mobile: number) => {
  try{
    mongoose.connect("mongodb://127.0.0.1:27017/PontinetDB");
    const db = mongoose.connection;
    db.on("error", (error) => console.log(error.message))
    const users = await Specialists.find({
        $or: [
            {
                "email": email

            },
            {
                "mobile": mobile
            }
        ]
    })

    db.close();
    console.log("Db connection closed")
    return users;
 
} catch(err: any){
    console.log(err.message)
}};
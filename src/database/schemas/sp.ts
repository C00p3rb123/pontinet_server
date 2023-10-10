import mongoose from "mongoose";

const sepcialistSchema = new mongoose.Schema({
    email: String,
    password: String, 
    mobile: Number
    
})



export default mongoose.model("Specialists", sepcialistSchema)
import mongoose from "mongoose";

const sepcialistSchema = new mongoose.Schema({
    name: String,
    age: Number, 
    
})



export default mongoose.model("Users", sepcialistSchema)
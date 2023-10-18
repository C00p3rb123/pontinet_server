import mongoose, {Document} from "mongoose";
interface Specialist extends Document {
    email: string;
    password: string;
    mobile: number
  }
const sepcialistSchema = new mongoose.Schema<Specialist>({
    email: {type: String, required: true},
    password: {type: String, required: true},
    mobile: {type: Number, required: true}
    
})



export default mongoose.model("Specialists", sepcialistSchema)
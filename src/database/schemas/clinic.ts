import mongoose, {Document, Types} from "mongoose";

interface Clinic extends Document {
    clinicId: Types.ObjectId
    clinicName: string;
    clinicCountry: string;
    clinicSuburb: string;
    clinicOnCallNumber: number;
  }
const clinicSchema = new mongoose.Schema<Clinic>({
    clinicName: {type: String},
    clinicCountry: {type: String},
    clinicSuburb: {type: String},
    clinicOnCallNumber: {type: Number}
    
}, {timestamps: true})
export default mongoose.model("Clinics", clinicSchema)
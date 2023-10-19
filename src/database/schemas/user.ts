import mongoose, {Document, Types} from "mongoose";
import { Clinic, specialistRegistration, userType } from "../../../types/users";
interface User extends Document {
    id: Types.ObjectId;
    email: string;
    password: string;
    mobile: number;
    type: userType;
    clinicId: string;
    registrationDetails: specialistRegistration
  }
const UserSchema = new mongoose.Schema<User>({
    email: {type: String},
    password: {type: String},
    mobile: {type: Number},
    type: {type: String},
    clinicId: {type: String},
    registrationDetails: {
      name: {type: String},
      specialisation: {type: String}, 
      subSpecialisation: {type: String},
      registrationId: {type: String},
      registrationCouncil: {type: String},
      mobileNumber: {type: Number}
    }

    
}, {timestamps: true})

export default mongoose.model("Users", UserSchema)
import mongoose, {Document, Types} from "mongoose";
import { DischargeInstructions, GeneralInstructions, PaitentInformation, SpecialisationResponse } from "../../../types/cases";

interface Case extends Document {
    paitentInformation: PaitentInformation;  
    specialistResponse: SpecialisationResponse;
  }

  const caseSchema = new mongoose.Schema<Case>({
    paitentInformation: {
      age: {type: Number},  
      illnessDescription: {type: Object},
      gp: {type: String},
      clinic: {type: String},
      referalDate: {type: String}
    },
    specialistResponse: {
      generalInstructions: {type: Object}, 
      dischargeInstructions: {type: Object},
      specialist: {type: String}
    },    
    
}, {timestamps: true})

export default mongoose.model("Cases", caseSchema)
  

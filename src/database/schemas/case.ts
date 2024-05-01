import mongoose, {Document} from "mongoose";
import { PaitentInformation, SpecialisationResponse } from "../../../types/cases";

interface Case extends Document {
    patientInformation: PatientInformation;  
    specialistResponse: SpecialisationResponse;
  }

  const caseSchema = new mongoose.Schema<Case>({
    patientInformation: {
      age: {type: Number},  
      illnessDescription: {type: Object},
      gp: {type: String},
      clinic: {type: String},
      referralDate: {type: String}
    },
    specialistResponse: {
      generalInstructions: {type: Object}, 
      dischargeInstructions: {type: Object},
      specialist: {type: Object},

    },    
    
}, {timestamps: true})

export default mongoose.model("Cases", caseSchema)
  

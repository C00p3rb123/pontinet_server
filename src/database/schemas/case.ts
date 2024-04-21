import mongoose, {Document, Types} from "mongoose";
import { DischargeInstructions, GeneralInstructions, PatientInformation } from "../../../types/cases";

interface Case extends Document {
    patientInformation: PatientInformation;    
    generalInstructions: GeneralInstructions;
    dischargeInstructions: DischargeInstructions;
    sepcialist: string;
  }

  const caseSchema = new mongoose.Schema<Case>({
    patientInformation: {
      age: {type: Number},  
      illnessDescription: {type: Object},
      gp: {type: String},
      clinic: {type: String},
      referralDate: {type: String}
    },
    generalInstructions: {
      
    }, 
    dischargeInstructions: {type: Object},
    sepcialist: {type: String}
}, {timestamps: true})

export default mongoose.model("Cases", caseSchema)
  

import mongoose, {Document, Types} from "mongoose";
import { DischargeInstructions, GeneralInstructions, PaitentInformation } from "../../../types/cases";

interface Case extends Document {
    paitentInformation: PaitentInformation;    
    generalInstructions: GeneralInstructions;
    dischargeInstructions: DischargeInstructions;
    sepcialist: string;
  }

  const caseSchema = new mongoose.Schema<Case>({
    paitentInformation: {
      age: {type: Number},  
      illnessDescription: {type: Object},
      gp: {type: String},
      clinic: {type: String},
      referalDate: {type: String}
    },
    generalInstructions: {
      
    }, 
    dischargeInstructions: {type: Object},
    sepcialist: {type: String}
}, {timestamps: true})

export default mongoose.model("Cases", caseSchema)
  

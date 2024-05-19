import mongoose, {Document} from "mongoose";
import { PatientInformation, SpecialisationResponse } from "../../../types/cases";
/**
 * Interface for a Case document.
 * Extends the Mongoose Document interface.
 */
interface Case extends Document {
    patientInformation: PatientInformation;  
    specialistResponse: SpecialisationResponse;
  }
/**
 * Mongoose schema for a Case document.
 */
  const caseSchema = new mongoose.Schema<Case>({
    patientInformation: {
      age: {type: Number},  
      illnessDescription: {type: Object},
      gp: {type: String},
      gpMobile: {type: Number},
      extraInformation: {type: String},
      clinic: {type: String},
    },
    specialistResponse: {
      generalInstructions: {type: Object}, 
      dischargeInstructions: {type: Object},
      specialist: {type: Object},
    },    
    
}, {timestamps: true}) //// Automatically adds createdAt and updatedAt fields

/**
 * Mongoose model for the Case schema.
 */
export default mongoose.model("Cases", caseSchema)
  

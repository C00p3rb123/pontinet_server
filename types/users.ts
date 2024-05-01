import mongoose, {Document, Types} from "mongoose";
import { type } from "os"

export type UserAccount = {
    _id?: Types.ObjectId,
    email: string,
    password: string,
    type: UserTypes,
    registrationDetails: specialistRegistration,
    clinicDetails: Clinic
}
export type UserPayload = {
    id: string,
    email: string,
}

export type specialistRegistration = {
    name: string,
    gender?: string,
    dateOfBirth?: string,
    specialisation: string, 
    subSpecialisation: string,
    dateOfSpecilisation?: string,
    registrationId: string,
    registrationCouncil: string,
    mobileNumber: number
}

export type Clinic = {
    clinicName: string,
    clinicCountry: string,
    clinicState: string,
    clinicSuburb: string,
}



export type userType = UserTypes.GP | UserTypes.SP 

export enum UserTypes  {
    GP = "General Practioner",
    SP = "Specialist",
    ADMIN = "Admin",
}




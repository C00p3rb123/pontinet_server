import mongoose, {Document, Types} from "mongoose";
import { type } from "os"

export type UserAccount = {
    email: string,
    password: string,
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
    clinicId: Types.ObjectId
    clinicName: string,
    clinicCountry: string,
    clinicSuburb: string,
    clinicOnCallNumber: number
}

export type userType = UserTypes.GP | UserTypes.SP 

export enum UserTypes  {
    GP = "General Practioner",
    SP = "Specialist"

}
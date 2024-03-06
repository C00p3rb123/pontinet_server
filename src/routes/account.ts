import express from "express";
import dotenv from "dotenv"
import morgan from "morgan";
import db from "../database/db";
import { dobValidator, emailValidator, hashPassowrd } from "../utils/account.services";
import Users from "../database/schemas/user"
import Clinics from "../database/schemas/clinic"
import { Clinic, UserAccount, specialistRegistration } from "../../types/users";
import mongoose from "mongoose";


const router = express.Router();
router.use(express.json());
router.use(morgan("tiny"));
router.use(express.json());

router.post("/register", async (req, res) => {

    const { email, password }: UserAccount = req.body;

    if (!email || !password) {
        res.status(400).json({ "error": true, "message": "Request body incomplete, email, password and mobile are required" });
        return;
    }

    const users = await db.get(Users, {email: email}, "email password");
    if (users) {
        res.status(400).json({ "error": true, "message": "Unable to store account" });
        return;
    }

    try {
        const hash = await hashPassowrd(password);
        const user = {
            email: email,
            password: hash
        }
        await db.set(Users, user) //need to fix this to be able to handle gps in the future. 
        res.status(200);
        res.send({
            "Message": `User with email ${email} has been successfully created`
        })
    } catch (err: any) {
        console.log(err.message);
        res.status(400).json({ "error": true, "message": `Unable to store account due to ${err.message}` });
    }

})

router.post("/register/clinic-details", async (req, res) => {

    const { clinicName, clinicCountry, clinicSuburb, clinicOnCallNumber }: Clinic = req.body;
    const email = req.body.email;    

    if (!clinicName || !clinicCountry || !clinicSuburb || !clinicOnCallNumber || !email) {
        return res.status(400).json({ error: "Invalid clinic details" });
    }
    const user = await db.exists(Users, {email})
    if (!user){
        return res.status(400).json({ error: "Unable to store clinic details as user does not exist" });
    }
    const clinic: Clinic = {
        _id: new mongoose.Types.ObjectId(),
        clinicName: clinicName,
        clinicCountry: clinicCountry,
        clinicSuburb: clinicSuburb,
        clinicOnCallNumber: clinicOnCallNumber,
    }
    try {
        const isClinic = await db.exists(Clinics, {clinicName: clinicName });
        if (!isClinic) {
        await db.set(Clinics, clinic);                                 
        }

        await db.update(Users, 'clinicId', email, clinic._id.toString());  
        return res.status(200).json({ message: "Clinic details received successfully" });   

    }catch(err: any){
        console.log(err.message)
        res.status(400).json({ "error": true, "message": `Unable to store account due to ${err.message}` });
    }
    
});

router.post("/register/sp-details", async (req, res) => {
    const {
        name,
        gender,
        dateOfBirth,
        specialisation,
        subSpecialisation,
        dateOfSpecilisation,
        registrationId,
        registrationCouncil,
        mobileNumber,
       
    }: specialistRegistration = req.body;

    const email = req.body.email;
    if (
        !name ||
        !specialisation ||
        !subSpecialisation ||
        !registrationId ||
        !registrationCouncil ||
        !mobileNumber ||
        !email
    ) {
        return res.status(400).json({ error: true, message: "Invalid SP details: All fields are required." });
    }
    const user = await db.get(Users, {email: email}, "email")
    if (!user){
        return res.status(400).json({ error: "Unable to store registration details as user does not exist" });
    }
    if (dateOfBirth && !dobValidator(dateOfBirth)) {
        return res.status(400).json({ error: true, message: "Invalid date of birth format. Use dd/mm/yyyy." });
    }
    if (dateOfSpecilisation && !dobValidator(dateOfSpecilisation)) {
        return res.status(400).json({ error: true, message: "Invalid date of specialisation format. Use dd/mm/yyyy." });
    }
    const registrationDetails = {
        name: name,
        specialisation: specialisation,
        subSpecialisation: subSpecialisation,
        registrationId: registrationId,
        registrationCouncil: registrationCouncil,
        mobileNumber: mobileNumber
    }
    try{
        await db.update(Users, 'registrationDetails', {email: email}, registrationDetails);
        return res.status(200).json({ message: "SP details received successfully" });
    } catch(err: any){
        console.log(err.message);
        return res.status(400).json({ error: true, message: `Unable to store registration details. Error message: ${err.message}` });
    }
    
    
});
router.post("/login", async (req, res) => {

   

})

export default router;


import express from "express";
import dotenv from "dotenv"
import morgan from "morgan";
import db from "../../database/db";
import { Case, PatientInformation } from "../../../types/cases";
import { createDocument, sendWhatsApp } from "../../utils/casesUtils";
import { mockCase } from "../../../mocks/case.mock";
import Cases from "../../database/schemas/case"
import { mock } from "node:test";
import { verifyToken } from "../../utils/auth";


const router = express.Router();
router.use(express.json());
router.use(morgan("tiny"));
router.use(express.json());


router.post("/send", verifyToken,  async (req, res) => {
    const spCase = req.body;
    console.log(spCase);
    const spResponse = {
        caseName: "Test case",
        patientInformation: spCase.patientInformation,
        generalInstructions: spCase.generalInstructions,
        dischargeInstructions: spCase.dischargeInstructions,
        specialist: `Dr Jonathan Chernilo`
    }
    try{
        const text = createDocument(spCase); 
        await db.set(Cases, spResponse);
        await sendWhatsApp(text);
        res.status(200);
        res.send({
            "Message": `WhatsApp messaage Sent`
        })

    }catch(err: any){
        console.log(err.message);
        res.status(400).json({ "error": true, "message": `Unable to send Whatsapp message due to ${err.message}` });
    }     
})
router.post("/recieve", verifyToken, async (req, res) =>{
    const patientInformation: PatientInformation  = req.body;
    await db.set(Cases, {
        patientInformation: patientInformation
    });
    res.status(200).send({
        "Message": "Received"
    });    
    }
)
router.get("/retrieve", verifyToken, async (req, res) => {
    try{
        const newCases = await db.getMany(Cases, {sepcialist: {$exists: false}}, "patientInformation");
        res.status(200).send(newCases)
    }catch(err: any){
        res.status(400).json({ "error": true, "message": `Unable to retrieve new cases due to ${err.message}` });
    }
    

})

export default router
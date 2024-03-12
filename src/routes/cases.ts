import express from "express";
import dotenv from "dotenv"
import morgan from "morgan";
import db from "../database/db";
import { Case } from "../../types/cases";
import { createDocument, sendWhatsApp } from "../utils/cases.service";
import { mockCase } from "../../mocks/case.mock";
import Cases from "../database/schemas/case"
import { mock } from "node:test";
import { verifyToken } from "../utils/auth";

const router = express.Router();
router.use(express.json());
router.use(morgan("tiny"));
router.use(express.json());


router.post("/send", verifyToken,  async (req, res) => {
    const spCase = req.body;
    console.log(spCase);
    const spResponse = {
        caseName: "Test case",
        paitentInformation: spCase.paitentInformation,
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

export default router
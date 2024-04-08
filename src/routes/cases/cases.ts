import express from "express";
import dotenv from "dotenv"
import morgan from "morgan";
import db from "../../database/db";
import { PaitentInformation } from "../../../types/cases";
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
    try{
    const caseId = await db.exists(Cases, {_id: spCase.id});
    if(!caseId){        
        throw new Error(`This case either does not exist or has already been aswered.`)
    }
    delete spCase.id;
        await db.update(Cases, [`specialistResponse`], caseId, spCase);
        const text = await createDocument(caseId._id.toString());         
        await sendWhatsApp(text);
        res.status(200);
        res.send({
            "Message": `WhatsApp messaage Sent`
        })

    }catch(err: any){
        console.log(err.message);
        res.status(400).json({ "error": true, "message": `${err.message}` });
    }     
})
router.post("/recieve", verifyToken, async (req, res) =>{
    const paitentInformation: PaitentInformation  = req.body;
    await db.set(Cases, {
        paitentInformation: paitentInformation
    });
    res.status(200).send({
        "Message": "Received"
    });    
    }
)
router.get("/retrieve", verifyToken, async (req, res) => {
    try{
        const newCases = await db.getMany(Cases, {specialistResponse: {$exists: false}}, "paitentInformation");
        res.status(200).send(newCases)
    }catch(err: any){
        res.status(400).json({ "error": true, "message": `Unable to retrieve new cases due to ${err.message}` });
    }
    

})

export default router
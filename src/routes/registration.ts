import express, { Router, Request, Response } from "express";
import dotenv from "dotenv"
import axios from "axios"


const router: Router = express.Router();
router.use(express.json());
router.post("/clinic-details", (req: Request, res: Response) => {
   
    const { clinicName, clinicCountry, clinicSuburb, clinicOnCallNumber } = req.body;

   
    if (!clinicName || !clinicCountry || !clinicSuburb || !clinicOnCallNumber) {
        return res.status(400).json({ error: "Invalid clinic details" });
    }

  
    return res.status(200).json({ message: "Clinic details received successfully" });
});

export default router;


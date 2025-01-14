import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import db from "../database/db";
import { Case, InitialCase, PatientInformation } from "../../types/cases";
import { createDocument, sendWhatsApp, encryptImage, decryptImage } from "../utils/casesUtils";
import { mockCase } from "../../mocks/case.mock";
import Cases from "../database/schemas/caseSchema";
import { mock } from "node:test";
import { verifyToken } from "../utils/auth";
import crypto from "crypto"

const router = express.Router();
router.use(express.json());
router.use(morgan("tiny"));
router.use(express.json());
/**
 * Route to send a specialist response.
 * Verifies the token, checks if the case exists and hasn't been answered,
 * creates a document, sends a WhatsApp message, and updates the case in the database.
 */
router.post("/send", verifyToken, async (req: any, res) => {
  let specialistResponse = req.body;
  try {
    // Retrieve the case from the database
    const medicalCase = await db.getOne(Cases, {
      _id: specialistResponse.id,
      specialistResponse: { $exists: false },
      
    });
    const mobile = medicalCase.patientInformation.gpMobile

    if (!medicalCase) {
      throw new Error(
        `This case either does not exist or has already been answered.`
      );
    }
    // Prepare the specialist response
    delete specialistResponse.id;
    
    specialistResponse.specialist = {
        ...specialistResponse.specialist,
        id: req.user.sub!
    }
    // Create document and send WhatsApp message
    const text = await createDocument(medicalCase, specialistResponse);
    await sendWhatsApp(text, mobile);
    // Update the case in the database
    await db.update(Cases, [`specialistResponse`], medicalCase._id, specialistResponse);    
    res.status(200);
    res.send({
      message: `WhatsApp messaage Sent`,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(400).json({ error: true, message: `${err.message}` });
  }
});
/**
 * Route to receive patient information from the chatbot.
 * This endpoint is called by the chatbot when a new case is created.
 * It verifies the token and stores the patient information in the database.
 */
router.post("/recieve", async (req, res) => {
  let patientInformation: PatientInformation = req.body;
  if(patientInformation.extraInformation){

    const encryptedUrl = patientInformation.extraInformation.replace(/([&?])(message_id|id)=([^&]+)/g, (match, connector, param, value) => {
      const encryptedValue = encryptImage(value);
      return `${connector}${param}=${encryptedValue}`;
  });
    patientInformation = {
      ...patientInformation,
      extraInformation: encryptedUrl      
    }
  }
  await db.set(Cases, {
    patientInformation: patientInformation,
  });
  res.status(200).send({
    Message: "Received",
  });
});
/**
 * Route to retrieve new cases.
 * Verifies the token and retrieves cases that haven't been answered by a specialist.
 */
router.get("/retrieve", verifyToken, async (req, res) => {
  try {
    const newCases = await db.getMany(
      Cases,
      { specialistResponse: { $exists: false }},
    );
    newCases.map((medicalCase: InitialCase) => {
      if(medicalCase.patientInformation.extraInformation){
        const decryptedUrl = medicalCase.patientInformation.extraInformation.replace(/([&?])(message_id|id)=([^&]+)/g, (match, connector, param, encryptedValue) => {
          const decryptedValue = decryptImage(encryptedValue);
          return `${connector}${param}=${decryptedValue}`;
      });
        medicalCase.patientInformation = {
          ...medicalCase.patientInformation,
          extraInformation: decryptedUrl
        }
      }
    })
    res.status(200).send(newCases);
  } catch (err: any) {
    res
      .status(400)
      .json({
        error: true,
        message: `Unable to retrieve new cases due to ${err.message}`,
      });
  }
});
/**
 * Route to retrieve cases answered by the authenticated user.
 * Verifies the token and retrieves cases that have been answered by the user.
 */
router.get("/retrieve/user", verifyToken, async (req: any, res) => {
  try {
    const userId = req.user.sub!;
    const cases = await db.getMany(
      Cases,
      { 'specialistResponse.specialist.id': userId },
    );
    res.status(200).send(cases);
  } catch (err: any) {
    res
      .status(400)
      .json({
        error: true,
        message: `Unable to retrieve new cases due to ${err.message}`,
      });
  }
});

export default router;
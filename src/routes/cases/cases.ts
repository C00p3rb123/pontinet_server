import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import db from "../../database/db";
import { PaitentInformation } from "../../../types/cases";
import { createDocument, sendWhatsApp } from "../../utils/casesUtils";
import { mockCase } from "../../../mocks/case.mock";
import Cases from "../../database/schemas/case";
import { mock } from "node:test";
import { verifyToken } from "../../utils/auth";

const router = express.Router();
router.use(express.json());
router.use(morgan("tiny"));
router.use(express.json());

router.post("/send", verifyToken, async (req: any, res) => {
  let specialistResponse = req.body;
  try {
    const medicalCase = await db.getOne(Cases, {
      _id: specialistResponse.id,
    });
    if (!medicalCase) {
      throw new Error(
        `This case either does not exist or has already been answered.`
      );
    }
    delete specialistResponse.id;
    specialistResponse.specialist = {
        ...specialistResponse.specialist,
        id: req.user.sub!
    }
    const text = await createDocument(medicalCase, specialistResponse);
    await sendWhatsApp(text);
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
router.post("/recieve", verifyToken, async (req, res) => {
  const paitentInformation: PaitentInformation = req.body;
  await db.set(Cases, {
    paitentInformation: paitentInformation,
  });
  res.status(200).send({
    Message: "Received",
  });
});
router.get("/retrieve", verifyToken, async (req, res) => {
  try {
    const newCases = await db.getMany(
      Cases,
      { specialistResponse: { $exists: false }},
    );
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

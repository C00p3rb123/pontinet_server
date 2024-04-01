import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import db from "../database/db";
import {
  generateToken,
  hashPassowrd,
  verifyPassword,
  verifyToken
} from "../utils/auth";
import Users from "../database/schemas/user";
import Clinics from "../database/schemas/clinic";
import { Clinic, UserAccount, specialistRegistration } from "../../types/users";
import mongoose from "mongoose";

const router = express.Router();
router.use(express.json());
router.use(morgan("tiny"));
router.use(express.json());

router.post("/register", async (req, res) => {
  const { email, password, type, registrationDetails, clinicDetails } = req.body;

  if (!email || !password || !type || !registrationDetails || !clinicDetails) {
    res
      .status(400)
      .json({
        error: true,
        message:
          "Request body incomplete, email, password, type, registration and clinic details are required",
      });
    return;
  }

  const isUser = await db.exists(Users, {email: email});
  if (isUser) {
    res.status(400).json({ error: true, message: "Unable to store account" });
    return;
  }

  const clinic: Clinic = {
    _id: new mongoose.Types.ObjectId(),
    clinicName: clinicDetails.clinicName,
    clinicCountry: clinicDetails.clinicCountry,
    clinicSuburb: clinicDetails.clinicSuburb,
    clinicOnCallNumber: clinicDetails.clinicOnCallNumber,
  };

  try {
    const isClinic = await db.exists(Clinics, { clinicName: clinicDetails.clinicName });
    if (!isClinic) {
      await db.set(Clinics, clinic);
    }

    await db.update(Users, "clinicId", email, clinic._id.toString());
  } catch (err: any) {
    console.log(err.message);
    res
      .status(400)
      .json({
        error: true,
        message: `Unable to store account due to ${err.message}`,
      });
  }

  try {
    const hash = await hashPassowrd(password);
    const user: UserAccount = {
      email: email,
      password: hash,
      type: type,
      registrationDetails: registrationDetails,
      clinicDetail: clinic
    };
    await db.set(Users, user); //need to fix this to be able to handle gps in the future.
    res.status(200);
    res.send({
      Message: `User with email ${email} has been successfully created`,
    });
  } catch (err: any) {
    console.log(err.message);
    res
      .status(400)
      .json({
        error: true,
        message: `Unable to store account due to ${err.message}`,
      });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({
        error: true,
        message: "Request body incomplete, email and password required",
      });
    return;
  }
  try{
    const user = await db.getOne(Users, { email: email }, "password");
    if (!user) {
      res.status(400).json({ error: true, message: "Invalid email or password" });
      return;
    }
    const hashedPassword = user.password;
    const result = await verifyPassword(password, hashedPassword);
    if (!result) {
      res.status(400).json({ error: true, message: "Invalid email or password" });
      return;
    }
    const token = await generateToken(email);
    res.status(200).send(({ token: `${token}` }))

  }catch(err){
    res.status(400).json({ error: true, message: "Invalid email or password" });
    return;
  }

});

export default router;

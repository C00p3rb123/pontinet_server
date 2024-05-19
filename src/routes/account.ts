import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import db from "../database/db";
import {
  generateToken,
  hashPassword,
  verifyPassword,
} from "../utils/auth";
import Users from "../database/schemas/userSchema";
import {UserAccount } from "../../types/users";
import { verifyToken } from "../utils/auth";

const router = express.Router();
router.use(express.json());
router.use(morgan("tiny"));
router.use(express.json());
/**
 * Route to register a new medical professional user.
 * Validates the request body, hashes the password, and stores the user in the database.
 */
router.post("/medical-professional/user/register", async (req, res) => {
  const { email, password, type, registrationDetails, clinicDetails } = req.body;
  // Check for required fields in the request body
  if (!email || !password || !type || !registrationDetails || !clinicDetails.clinicName) {
    console.error(`Request body incomplete, email, password, type, registration and clinic details are required`)

    res
      .status(400)
      .json({
        error: true,
        message:
          "Request body incomplete, email, password, type, registration and clinic details are required",
      });
    return;
  }
  // Check if user already exists
  const isUser = await db.exists(Users, {email: email});
  if (isUser) {
    res.status(400).json({ error: true, message: "Unable to store account" });
    return;
  }

  try {
    // Hash the password and create a new user object
    const hash = await hashPassword(password);
    const user: UserAccount = {
      email: email,
      password: hash,
      type: type,
      registrationDetails: registrationDetails,
      clinicDetails: clinicDetails
    };
    // Store the user in the database
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
/**
 * Route to log in a user.
 * Validates the request body, verifies the password, and generates a token.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
 // Check for required fields in the request body
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
    // Retrieve the user from the database
    const user = await db.getOne(Users, { email: email }, "password");
    if (!user) {
      res.status(400).json({ error: true, message: "Invalid email or password" });
      return;
    }
     // Verify the password
    const hashedPassword = user.password;
    const result = await verifyPassword(password, hashedPassword);
    if (!result) {
      res.status(400).json({ error: true, message: "Invalid email or password" });
      return;
    }
    // Generate a token
    const token = await generateToken(email);
    res.status(200).send(({ token: `${token}`}))

  }catch(err){
    res.status(400).json({ error: true, message: "Invalid email or password" });
    return;
  }

}
);
/**
 * Route to get user details.
 * Verifies the token, retrieves user details from the database, and sends them in the response.
 */
router.get("/user", verifyToken,async (req: any, res) => {
   const userId = req.user.sub!;
   if(!userId){
    res.status(400).json({ error: true, message: "User does not exist" });
   }
  try{
    // Retrieve user details from the database
    const user = await db.getOne(Users, {_id: userId}, "registrationDetails clinicDetails");
    res.status(200).send(({name: user.registrationDetails.name, clinic: user.clinicDetails.clinicName, country: user.clinicDetails.clinicCountry}))

  }catch(err){
    res.status(400).json({ error: true, message: "Unable to find user" });
    return;
  }

}
);

export default router;

import express from "express"
import dotenv from "dotenv"
import axios from "axios"
import morgan from "morgan";
import { error } from "console";


const router = express.Router();
router.use(morgan("tiny"));

router.post("/account", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const mobile = req.body.mobile; 

    if(!email || !password){
        res.status(400).json({"error": true, "message": "Request body incomplete, both email and password are required"})
    }
    
    
})

router.get("/clinic-details", (req, res) => {
    
    console.log("Registration")
})

export default router


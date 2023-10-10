import express from "express"
import dotenv from "dotenv"
import axios from "axios"
import morgan from "morgan";
import { error } from "console";
import { checkForUsers } from "../utils/queries";
import { hashPassowrd, storeUser } from "../utils/reigstration";


const router = express.Router();
router.use(express.json());
router.use(morgan("tiny"));

router.post("/account", async (req, res) => {

    const { email, password, mobile } = req.body
    if (!email || !password || !mobile) {
        res.status(400).json({ "error": true, "message": "Request body incomplete, email, password and mobile are required" });
        return;
    }

    const users = await checkForUsers(email, mobile);
    if (users) {
        res.status(400).json({ "error": true, "message": "User already exists" });
        return;
    }

    try{
        const hash = await hashPassowrd(password);
        storeUser(email, hash, mobile);
        res.status(200);
        res.send({
            "Message": `User with email ${email} has been successfully created`
        })
    }catch(err: any){
        console.log(err.message); 
    }     

})

router.post("/clinic-details", (req, res) => {
 
})

export default router


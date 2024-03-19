import express from "express"
import dotenv from "dotenv"
import axios from "axios"
import { verifyToken } from "../utils/auth";


const router = express.Router();


router.post("/send", verifyToken, (req, res) => {
    const url = 'https://graph.facebook.com/v18.0/128242553703490/messages';
    const accessToken = process.env.WHATSAPP_ACCESS;
    const phoneNumber = '+61433965955';
    const messageContent = 'Message from Pontinet Api';

    const requestBody = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'text',
        text: {
            preview_url: false,
            body: messageContent
        }
    };

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    axios.post(url, requestBody, { headers })
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error.message);

            console.log("Registration")
        })

    })

    export default router
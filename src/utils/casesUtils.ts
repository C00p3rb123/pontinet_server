import { Case } from "../../types/cases";
import fs from "fs"
import axios from "axios";

export const createDocument = (spCaseResponse: Case) => {

const jsonString = JSON.stringify(spCaseResponse, null, 2);
const text = 
`PONTINET SPECIALIST RESPONSE\n\n
Personal Information:\n
- Age: ${spCaseResponse.patientInformation.age}\n
- Description: ${spCaseResponse.patientInformation.illnessDescription}\n
- GP: ${spCaseResponse.patientInformation.gp}\n
- Clinic : ${spCaseResponse.patientInformation.clinic}\n
- Regeral Date: ${spCaseResponse.patientInformation.referralDate}\n\n
General Instructions:\n
- Diagnostic Impression: ${spCaseResponse.generalInstructions.diagnosticImpression}\n\n
Discharge Instructions: \n
- General Indications: ${spCaseResponse.dischargeInstructions.generalIndications}\n
- Medication: ${spCaseResponse.dischargeInstructions.medication}\n
- Follow Up: ${spCaseResponse.dischargeInstructions.followUpDetails}\n
`
return text

}

export const sendWhatsApp = (text: string) => {
    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_SENDER}/messages`;
    const accessToken = process.env.WHATSAPP_ACCESS;
    const phoneNumber = process.env.MOBILE;
    const messageContent = text;

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
    console.log(text);
}
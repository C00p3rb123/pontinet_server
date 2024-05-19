import { Case } from "../../types/cases";
import axios from "axios";
import { SpecialisationResponse } from "../../types/cases";
import crypto from "crypto"

export const createDocument = async (medicalCase: Case, specialistResponse: SpecialisationResponse) => {
  try {
  
    
    const text = `PONTINET SPECIALIST RESPONSE\n\n
      Personal Information:\n
      - Age: ${medicalCase.patientInformation.age}\n
      - Description: ${medicalCase.patientInformation.illnessDescription.segment}\n${medicalCase.patientInformation.illnessDescription.mechanism}\n
      - GP: ${medicalCase.patientInformation.gp}\n
      - Referral Date: ${medicalCase.createdAt}\n\n
      General Instructions:\n
      - Diagnostic Impression: ${specialistResponse.generalInstructions.diagnosticImpression}\n\n
      - On site procedure: ${specialistResponse.generalInstructions.onSiteProcedure}\n\n
      - On site medication: ${specialistResponse.generalInstructions.onSiteMedication}\n\n
      Discharge Instructions: \n
      - General Indications: ${specialistResponse.dischargeInstructions.generalIndications}\n
      - Medication: ${specialistResponse.dischargeInstructions.medication}\n
      - Follow Up: ${specialistResponse.dischargeInstructions.followUpDetails}\n
      `;
    return text;
  } catch (err: any) {
    console.log(err)
    throw new Error(err.messaage);
  }
};

export const sendWhatsApp = (text: string, mobile: string) => {
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_SENDER}/messages`;
  const accessToken = process.env.WHATSAPP_ACCESS;
  const phoneNumber = mobile;
  const messageContent = text;

  const requestBody = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "text",
    text: {
      preview_url: false,
      body: messageContent,
    },
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  axios
    .post(url, requestBody, { headers })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
  console.log(text);
};

//Please keep in mind the following encryption and decryption functions are designed to handle sendPulse documentation only.  
// Function to encrypt an image URI
const secret = process.env.DOCUMENT_SECRET!;
export const encryptImage = (uri: string): string => {
  const algorithm = "aes-256-cbc";
  const iv = crypto.randomBytes(16); // Generate IV once
  const key = crypto.scryptSync(secret, 'salt', 32);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(uri, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Prepend IV to the encrypted data
  const encryptedDataWithIV = iv.toString('hex') + encrypted;
  return encryptedDataWithIV;
}
export const decryptImage = (encryptedText: string): string => {
  const algorithm = "aes-256-cbc";
  const iv = Buffer.from(encryptedText.slice(0, 32), 'hex'); // Extract IV from the encrypted text
  const encryptedData = encryptedText.slice(32); // Extract encrypted data

  const key = crypto.scryptSync(secret, 'salt', 32);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

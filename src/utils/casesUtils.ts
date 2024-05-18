import { Case } from "../../types/cases";
import axios from "axios";
import { SpecialisationResponse } from "../../types/cases";
/**
 * Creates a document with specialist response details.
 * @param {Case} medicalCase - The medical case details.
 * @param {SpecialisationResponse} specialistResponse - The specialist's response details.
 * @returns {Promise<string>} - The formatted text document as a string.
 * @throws {Error} - If an error occurs during the creation of the document.
 */
export const createDocument = async (medicalCase: Case, specialistResponse: SpecialisationResponse) => {
  try {
  
    
    const text = `PONTINET SPECIALIST RESPONSE\n\n
      Personal Information:\n
      - Age: ${medicalCase.patientInformation.age}\n
      - Description: ${medicalCase.patientInformation.illnessDescription.segment}\n${medicalCase.patientInformation.illnessDescription.mechanism}\n
      - GP: ${medicalCase.patientInformation.gp}\n
      - Regeral Date: ${medicalCase.patientInformation.referralDate}\n\n
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
/**
 * Sends a WhatsApp message with the provided text.
 * @param {string} text - The text message to send.
 */
export const sendWhatsApp = (text: string) => {
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_SENDER}/messages`;
  const accessToken = process.env.WHATSAPP_ACCESS;
  const phoneNumber = process.env.MOBILE;
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

      console.log("Registration");
    });
  console.log(text);
};

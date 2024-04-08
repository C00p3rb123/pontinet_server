import { Case } from "../../types/cases";
import fs from "fs";
import axios from "axios";
import db from "../database/db";
import Cases from "../database/schemas/case";
export const createDocument = async (caseId: string) => {
  try {
    const entireCase = await db.getOne(Cases, { _id: caseId });
    // console.log(entireCase);
    const text = `PONTINET SPECIALIST RESPONSE\n\n
      Personal Information:\n
      - Age: ${entireCase.paitentInformation.age}\n
      - Description: ${entireCase.paitentInformation.illnessDescription.segment}\n${entireCase.paitentInformation.illnessDescription.mechanism}\n
      - GP: ${entireCase.paitentInformation.gp}\n
      - Regeral Date: ${entireCase.paitentInformation.referalDate}\n\n
      General Instructions:\n
      - Diagnostic Impression: ${entireCase.specialistResponse.generalInstructions.diagnosticImpression}\n\n
      - On site procedure: ${entireCase.specialistResponse.generalInstructions.onSiteProcedure}\n\n
      - On site medication: ${entireCase.specialistResponse.generalInstructions.onSiteMedication}\n\n
      Discharge Instructions: \n
      - General Indications: ${entireCase.specialistResponse.dischargeInstructions.generalIndications}\n
      - Medication: ${entireCase.specialistResponse.dischargeInstructions.medication}\n
      - Follow Up: ${entireCase.specialistResponse.dischargeInstructions.followUpDetails}\n
      `;
    return text;
  } catch (err: any) {
    throw new Error(`Unable to set up text to be sent to GP`);
  }
};

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

import express from "express";

import dotenv from "dotenv";
import morgan from "morgan";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerUI = require("swagger-ui-express");
import registrationRouter from "../src/routes/registration"
import messagesRouter from "../src/routes/whatsapp"
const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(morgan("tiny"));
app.use("/registration", registrationRouter);
app.use("/whatsapp", messagesRouter);

app.get("/hello/testing", (req, res) => {
  console.log("Hello xcvxcv");
});

app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);
});

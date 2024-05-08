import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerUI = require("swagger-ui-express");
import accountRouter from "./routes/account"
import caseRouter from "./routes/cases"
import cors from "cors"; 


const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
app.use(morgan("tiny"));
app.use("/account", accountRouter);
app.use("/cases", caseRouter);

app.get("/hello/testing", (req, res) => {
  console.log("Hello xcvxcv");
});

app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);
});

export default app

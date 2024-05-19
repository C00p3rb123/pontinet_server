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
// Define the port from environment variables
const PORT = process.env.PORT;
// Set up logging and request parsing middleware
app.use(morgan("tiny"));
// Set up routes
app.use("/account", accountRouter);
app.use("/cases", caseRouter);
// Simple test route
app.get("/hello/testing", (req, res) => {
  console.log("Hello xcvxcv");
});
// Start the server
app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);
});

export default app

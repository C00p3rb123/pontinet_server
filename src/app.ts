import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerUI = require("swagger-ui-express");
import accountRouter from "./routes/account"
import messagesRouter from "../src/routes/whatsapp"
import caseRouter from "../src/routes/cases"


import User from "../src/database/schemas/user";


const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT;

//TEST THE DB WORKS AND THEN YOU CAN REMOVE LINES 18-34
// mongoose.connect("mongodb://127.0.0.1:27017/PontinetDB");
// const db = mongoose.connection;
// db.on("error", (error) => console.log(error.message))
// 
// const testDb = async () => {
  // try{
// 
    // const user = await Specialists.create({ email: "dev", password: "sdfsdf", mobile: 0o40000000000  });
    // await user.save();
    // console.log(user);
  // } catch(err: any) {
    // console.log(err.message)
  // }; 
// 
// };

// testDb();

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

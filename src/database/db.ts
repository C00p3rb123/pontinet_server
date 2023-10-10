
import mongoose, { ConnectOptions } from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/PontinetDB");
const db = mongoose.connection;
db.on("error", (error) => console.log(error.message))
db.once('open', () => {
    console.log('Connected to MongoDB');
  });

export default db

import mongoose, { ConnectOptions, Model, Document } from "mongoose";
import dotenv from "dotenv"
import { Specialist } from "../../types/users";
import Specialists from "../database/schemas/sp";

interface PontinetDbConnection {
  // Method to establish a connection to the database
  connect(connectionString?: string): any;
  // Method to close the database connection
  close(connection: any): void;  
  // Method to insert data into the database
  insert(table?: any, data?: any): Promise<void>;
  // Method to delete data from the database
  delete(table: string, condition: string, params?: any[]): Promise<void>;
  // Optional: method to check if the connection is established
  isConnected(): boolean;
  // Method to see if user is present in the DB
  isUser(email: string, mobile: number): any;
}

class MongoDBConnection implements PontinetDbConnection {

  db: mongoose.Connection
   constructor(connectionString: string | undefined) {
    this.connect(connectionString);
    this.db = mongoose.connection;
  }
  async connect(connectionString: string | undefined): Promise<void> {
    
    if (!connectionString) {
      throw new Error("Unable to connect to DB");
    }
    await mongoose.connect(connectionString);

  }

  close(connection: mongoose.Connection): void {
    if (!connection) {
      throw new Error("Method not implemented.");
    }
    connection.close();

  }
  async isUser(email: string, mobile: number): Promise<{
    _id: mongoose.Types.ObjectId;
  } | null> {
    if(!email || !mobile){
      throw new Error("Invalid email or mobile provided to isUser")
    }
    try {
      this.db.on("error", (error) => console.log(error.message))
      const users = await Specialists.exists({
        $or: [
          {
            "email": email

          },
          {
            "mobile": mobile
          }
        ]
      })
      return users;

    } catch (err: any) {
      console.log(err.message)
    }
    throw new Error("Method not implemented.");
  }

  async insert<T extends Document>(model: Model<T>, data: Specialist): Promise<void> {
    if (!model) {
      throw new Error("Invalid MongoDB Model.");
    }
    if (!data) {
      throw new Error("Invalid data for insert function");
    }
    try{
      await model.create(data);
    }
    catch (err: any){
      console.log(err.message)
    }   

  }
  delete(table: string, condition: string, params?: any[] | undefined): Promise<void> {
    throw new Error("Method not implemented.");
  }
  isConnected(): boolean {
    throw new Error("Method not implemented.");
  }

}

const db = new MongoDBConnection("mongodb://127.0.0.1:27017/PontinetDB")

export default db

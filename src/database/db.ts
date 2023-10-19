
import mongoose, { ConnectOptions, Model, Document, Types } from "mongoose";
import dotenv from "dotenv"
import Users from "./schemas/user";
import Clinics from "../database/schemas/clinic"
import { error } from "console";
import { Clinic, specialistRegistration } from "../../types/users";
import user from "./schemas/user";

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

class PontinetMongoDBConnection implements PontinetDbConnection {

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
  async isUser(identifier: string | number): Promise<{
    _id: mongoose.Types.ObjectId;
  } | null> {
    if(!identifier){
      console.log(`Invalid email or mobile provided to isUser`);
      return null
    }
    try {
      if (typeof identifier === 'string'){ 
        this.db.on("error", (error) => console.log(error.message))
        const users = await Users.exists({ email: identifier
      })
      return users
    }
      
      else{
        this.db.on("error", (error) => console.log(error.message))
        const users = await Users.exists({ mobilenumber: identifier
      })
      return users
      }
      
      

    } catch (err: any) {
      console.log(err.message)
    }
    throw new Error("Method not implemented.");
  }
  async updateUserClinic(email: string, clinicId: string): Promise<void> {
    
    if(!clinicId || !email){
      throw new Error(`Either email or clinicId are missing`)
    }
    try{
      const user = await Users.findOne({email})
      if(!user){
        throw new Error(`No user found, unable to update clinic`)
      }      
      user.clinicId = clinicId;
      await user.save();
      console.log(`User ${email} has successfully updated their clinic`);            
      
    }catch(err:any){
      console.log(err.message);
    }

  }
  async updateUserRegistrationDetails(email: string, registrationDetails: specialistRegistration): Promise<void>{
    if(!registrationDetails || !email){
      throw new Error(`Either email or registrationDetails are missing`)
    }
    try{
      const user = await Users.findOne({email});
      if(!user){
        throw new Error(`No user found, unable to update clinic`)
      } 
      user.registrationDetails = registrationDetails;
      await user.save();
      console.log(`User ${email} has successfully updated their registrationDetails`);
    }catch (err: any) {
      console.log(err.message)
    }
  }
  async isClinic(clinicName: string): Promise<{
    _id: mongoose.Types.ObjectId;
  } | null> {
    if(!clinicName){
      throw new Error("Invalid clinicName")
    }
    try {
      this.db.on("error", (error) => console.log(error.message))
      const clinc = await Users.exists({clinicName: clinicName})
      return clinc;

    } catch (err: any) {
      console.log(err.message)
    }
    throw new Error("Method not implemented.");
  }

  async insert<T extends Document>(model: Model<T>, data: any): Promise<any> {
    if (!model) {
      throw new Error("Invalid MongoDB Model.");
    }
    if (!data) {
      throw new Error("Invalid data for insert function");
    }
    try{
        await model.create(data)
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

const db = new PontinetMongoDBConnection("mongodb://127.0.0.1:27017/PontinetDB")

export default db

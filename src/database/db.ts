
import mongoose, { ConnectOptions, Model, Document, Types } from "mongoose";
import dotenv from "dotenv"
import Users from "./schemas/user";
import { error } from "console";
import { Clinic,  specialistRegistration } from "../../types/users";
import user from "./schemas/user";
import { Mode } from "fs";

dotenv.config();

interface PontinetDbConnection {
  // Method to establish a connection to the database
  connect(connectionString?: string): any;
  // Method to close the database connection
  
  close(connection: any): void;  
   // Method to see retrieve a document 
  getOne(table: any , key: string, value: any, output: string): any;
  //Method to retrieve multiple documents
  getMany(table: any , key: string, value: any, output: string): any;
  // Method to setDocument data into the database
  set(table: any, data?: any): Promise<void>;
  //Check if Row or document exists
  exists(table: any, query: any): any
  // Method to delete data from the database
  delete(table: string, condition: string, params?: any[]): Promise<void>;
  // Optional: method to check if the connection is established
  isConnected(): boolean;
 
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
  
/**
 * get Document returns a document with its specified field/s
 * @param model: This is the collection in the DB
 *@param query; The document you wish to 
 * @param output: The specific attributes you want returned
 * @returns a document with specified fields defined by output 
 */

  async getOne<T extends Document>(model: Model<T>, query: Object, output: string ): Promise<any>{
    
    if(!model || !query){
      throw new Error("Model, key or value is invalid in getDocument");
    }
    try{
      const document:any = await model.findOne(query).select(output).exec();
      if(!document){
        throw new Error('Invalid request')
      }
      return document._doc
      
    }catch(err: any){
      console.log(err.message)
      throw new Error(err.message);
    }
  }
  async getMany<T extends Document>(model: Model<T>, query: Object, output?: string ): Promise<any>{
    if(!model || !query){
      throw new Error("Model, key or value is invalid in getDocument");
    }
    try{
      
      if(!output){
        const document:any = (await model.find(query)).map((doc: any) => {
          return doc._doc;
        })
        return document;
      }
      const document:any = (await model.find(query).select(output).exec()).map((doc: any) => {
        return doc._doc;
      });
      return document      
      
    }catch(err: any){
      console.log(err.message)
      throw new Error(err.message);
    }

  }
  async set<T extends Document>(model: Model<T>, data: any): Promise<any> {
    if (!model) {
      throw new Error("Invalid MongoDB Model.");
    }
    if (!data) {
      throw new Error("Invalid data for setDocument function");
    }
    try{
        await model.create(data)
    }
    catch (err: any){
      console.log(err.message)
    }   

  }
  //model, attribute, query
  async update<T extends Document>(model: Model<T>, attribute: keyof T, query: Object, newData: T[keyof T] ): Promise<void>{
    if(!model || !attribute || !query|| !newData){
      throw new Error(`update missing parameters`)
    }
    try{
      const document = await model.findOne(query);
      if(!document){
        throw new Error(`No document found in update`)
      } 
      (document as any)[attribute] = newData;
      await document.save();
      console.log(`User has successfully updated their registrationDetails`);
    }catch (err: any) {
      console.log(err.message)
    }
  }
  async exists<T extends Document>(model: Model<T>, query: Object ){
      if(!model || !query){
        throw new Error("Model or data is invalid");
      }
      try{
        const result = await model.exists(query);
        return result
      }catch(err: any){
        console.log(err.message)
        throw new Error(err.message);
      }
  }

  delete(table: string, condition: string, params?: any[] | undefined): Promise<void> {
    throw new Error("Method not implemented.");
  }
  isConnected(): boolean {
    throw new Error("Method not implemented.");
  }

}

const db = new PontinetMongoDBConnection(process.env.DB_CONNECTION)

export default db

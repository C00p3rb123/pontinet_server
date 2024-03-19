import bcrypt from "bcrypt";
import mongoose, { ConnectOptions } from "mongoose";
import Specialists from "../database/schemas/user";
import db from "../database/db";
import { error } from "console";
import user from "../database/schemas/user";
import jwt from "jsonwebtoken"
import Users from "../database/schemas/user"

export const dobValidator = (dateOfBirth: string): boolean => {
  const dateOfBirthRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dateOfBirth.match(dateOfBirthRegex)) {
    return false;
  }
  return true;
};
/**
 * 
 * @param email This is the email that will be validated
 * @returns True if the email is formatted correctly otherwise false
 */
export const emailValidator = (email: string): boolean => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
};

import db from "../database/db";
import Users from "../database/schemas/userSchema"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
/**
 * 
 * @param email This email is used to identify an individual in the database
 * @returns JWT token for authentication
 */
export const generateToken = async (email: string): Promise<string> => {
    const user = await db.getOne(Users, {email: email}, "type" );
    if(!user){
        throw new Error("Unable to generate token")
    }
    const payload = {
        sub: user._id.toString(),
        username: email,
        role: user.type,
        iat: Math.floor(Date.now() / 1000)
    }
    const token = jwt.sign(payload, process.env.SECRET!, {expiresIn: '1d'})
    return token
}
/**
 * Middleware to verify JWT token.
 * @param {any} req - The request object.
 * @param {any} res - The response object.
 * @param {any} next - The next middleware function.
 * @returns {void}
 */
export const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(" ")[1];
  if(!token){
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }
  try{
    const decoded = jwt.verify(token, process.env.SECRET!);
    req.user = decoded;
    next();
  }catch(err: any){
    return res.status(403).json({ message: 'Invalid token.' });
  }
} 
/**
 * Verifies if the provided password matches the hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 * @throws {Error} - If parameters are missing or an error occurs during comparison.
 */
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  if (!password || !hashedPassword) {
    throw new Error("verifyPassword is missing parameters");
  }
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result
  } catch (err: any) {
    console.error(err.message);
    return false
  }
};
/**
 * Hashes the provided password.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hashed password.
 * @throws {Error} - If password is not provided.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    if (!password) {
      throw new Error("Password unable to be stored");
    }
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  };
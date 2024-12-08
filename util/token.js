import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()
const SECRET_KEY = process.env.TOKEN_SECRET; 

export const generateToken = (userId) => {
    const payload = { id: userId }; 
    const options = { expiresIn: "7h" };
    return jwt.sign(payload, SECRET_KEY, options);
};

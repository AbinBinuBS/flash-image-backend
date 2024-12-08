import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

function DbConnect(){
    try{
        mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected with mongodb");
    }catch(error){
        console.log(error.message);
    }
}

export default DbConnect
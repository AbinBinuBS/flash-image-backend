import express from 'express'
import dotenv from 'dotenv'
import DbConnect from './config/db.js'
import cors from 'cors'
import userRouter from './routes/userRouter.js'


const PORT = process.env.PORT
dotenv.config()
DbConnect()
const app = express()
 

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"] 
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/',userRouter)

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
})
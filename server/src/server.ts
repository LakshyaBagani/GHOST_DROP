import express from 'express'
import { Request , Response } from 'express';
import dotenv from 'dotenv';

dotenv.config()
const app = express();

app.get('/' , (req:Request,res:Response)=>{
    res.send("Hello World")
})

app.listen(3000,()=>{
    console.log("Listening on the port 3000");
    console.log(process.env.DATABASE_URL);
    
})
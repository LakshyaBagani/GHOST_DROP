import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from "./routes/authRoute";
import fileRoute from "./routes/fileRoute";
import cors from "cors"

dotenv.config()
const app = express();
app.use(cors({
  origin: 'https://ghost-drop-tqzj.vercel.app/signin',
  credentials: true, 
}));
app.use(cookieParser())
app.use(express.json())

app.use('/auth' , authRoute)
app.use('/files' , fileRoute)

app.listen(3000,()=>{
    console.log("Listening on the port 3000"); 
    
})
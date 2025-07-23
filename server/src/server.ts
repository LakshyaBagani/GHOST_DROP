import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from "./routes/authRoute";
import fileRoute from "./routes/fileRoute";
import cors from "cors"

dotenv.config()
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // if you're using cookies/auth headers
}));
app.use(cookieParser())
app.use(express.json())

app.use('/auth' , authRoute)
app.use('/files' , fileRoute)

app.listen(3000,()=>{
    console.log("Listening on the port 3000"); 
    
})
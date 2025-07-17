import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from "./routes/authRoute";

dotenv.config()
const app = express();
app.use(cookieParser())
app.use(express.json())

app.use('/auth' , authRoute)

app.listen(3000,()=>{
    console.log("Listening on the port 3000"); 
})
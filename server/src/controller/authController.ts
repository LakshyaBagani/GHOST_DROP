import { Request , Response } from "express";

export const Login = async (req:Request,res:Response)=>{
    const {email,password} = req.body;
    
}
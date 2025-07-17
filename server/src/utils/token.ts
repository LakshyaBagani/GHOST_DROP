import jwt from 'jsonwebtoken'
import { Response } from 'express'

const generateToken = async (UserId:number,res:Response) : Promise<string> =>{

    if(!process.env.MY_SERCET_KEY){
        console.error("JWT key is not define in enviornment variables")
        throw new Error("JWT secret key undefined")
    }

    const token = jwt.sign({UserId} , process.env.MY_SERCET_KEY , {expiresIn:'15d'})
    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		sameSite: "strict", 
		secure: false,
    })
    return token;
}

export default generateToken
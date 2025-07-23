import jwt from "jsonwebtoken"
import { randomUUID } from "crypto"
import prisma from "../config/db"

export const generateLink = async (hash:String , expireTime:any , iv:String , mimeType:String)=>{
    const tokenId = randomUUID()
    const exp = Math.floor(Date.now() / 1000) + 60 * expireTime
    const payload = {
        hash:hash,
        iv:iv,
        tokenId,
        exp, 
        mimeType
    }

    const token = jwt.sign(payload , process.env.MY_SERCET_KEY!)

    await prisma.link.create({
        data:{
            token,
            tokenId,
            expiresAt: new Date(exp*1000)
        }
    })

    const link = `http://localhost:3000/files/content?token=${token}`
    return link;
}
import jwt from "jsonwebtoken"
import { randomUUID } from "crypto"

export const generateLink = async (hash:String , expireTime:any , iv:String)=>{
    const tokenId = randomUUID()
    const payload = {
        hash:hash,
        iv:iv,
        tokenId:tokenId,
        exp : Math.floor(Date.now() / 1000) + 60 * expireTime
    }

    const token = jwt.sign(payload , process.env.MY_SERCET_KEY!)
    const link = `http://localhost:3000/content?token=${token}`
    return link
}
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request{
    userId? : number
}

const authProtect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.jwt;
  try {
    if (!token) {
      res
        .status(401)
        .send({ success: false, message: "Unable to find the jwt token" });
    }

    if (!process.env.MY_SERCET_KEY) {
      console.error("JWT key is not define in enviornment variables");
      throw new Error("JWT secret key undefined");
    }

    const decode = jwt.verify(token, process.env.MY_SERCET_KEY) as {userId:number};
    req.userId = decode.userId
    next()
  } catch (error) {
    res.status(401).send({ success: false, message: error });
  }
};

export default authProtect
export type {AuthRequest}
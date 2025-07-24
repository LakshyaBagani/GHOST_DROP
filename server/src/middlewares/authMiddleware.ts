import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: number;
}

const authProtect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.MY_SERCET_KEY) {
      console.error("JWT key is not defined in environment variables");
      throw new Error("JWT secret key undefined");
    }

    const decode = jwt.verify(token, process.env.MY_SERCET_KEY) as { userId: number };
    req.userId = decode.userId;

    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Invalid or expired token" });
  }
};

export default authProtect;
export type { AuthRequest };

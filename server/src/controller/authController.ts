import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../config/db";
import generateToken from "../utils/token";

export const Signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .send({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = await generateToken(newUser.id, res);

    return res.status(200).send({
      success: true,
      message: "User created successfully",
      token,
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User does not exists" });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return res
        .status(401)
        .send({ success: false, message: "Password does not match" });
    }

    const token = await generateToken(user.id, res);

    return res.status(200).send({
      success: true,
      message: "User logged in successfully",
      token,
      user: { email: user.email },
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};


export const Logout = async (req:Request,res:Response) => {
    try {
        res.clearCookie("jwt")
        return res.status(200).send({success:true , message:"User log out successfully"})
    } catch (error) {
        return res.status(500).send({success:false , message:error})
    }
}

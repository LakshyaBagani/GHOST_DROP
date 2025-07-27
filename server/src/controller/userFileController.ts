import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import prisma from "../config/db";

export const getAllFiles = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .send({ success: false, messsage: "User not found" });
    }

    const files = await prisma.files.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        link: {
          select: {
            used: true,
            Link: true
          },
        },
      },
    });

    if (files.length == 0) {
      return res
        .status(401)
        .send({ success: false, message: "No files found" });
    }

    return res.status(200).send({ success: true, files });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

import { Request, Response } from "express";
import crypto from "crypto";
import { encryptContent } from "../utils/manageContent";
import { supabase } from "../config/supabaseconfig";
import prisma from "../config/db";
import { AuthRequest } from "../middlewares/authMiddleware";

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(401).send({ success: false, message: "No file found" });
    }
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const mimeType = req.file.mimetype;
    const hash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");
    const { iv, data } = encryptContent(req.file.buffer);
    const filePath = `${hash}_${req.file.originalname}`;
    const { error } = await supabase.storage
      .from("ghost-bucket")
      .upload(filePath, Buffer.from(data, "hex"), {
        contentType: mimeType,
      });

    if (error) return res.status(500).send({ error: error.message });

    await prisma.files.create({
      data: {
        iv,
        hash,
        filePath,
        mimeType,
        fileName: req.file.originalname,
        userId,
      },
    });

    return res
      .status(200)
      .send({
        success: true,
        message: "Files uploaded successfully",
        userId: userId,
      });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  try {
    const hash = req.params.hash;
    const files = await supabase.storage.from("ghost-bucket").list();
    const requireFile = files.data?.find((f) => f.name.startsWith(hash));
    if (!requireFile) return res.status(404).send("Not found");
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

import { Request, Response } from "express";
import crypto from "crypto";
import { encryptContent } from "../utils/manageContent";
import { supabase } from "../config/supabaseconfig";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(401).send({ success: false, message: "No file found" });
    }
    const hash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");
    const { iv, data } = encryptContent(req.file.buffer);
    const filePath = `${hash}_${req.file.originalname}`;
    const { error } = await supabase.storage
      .from("ghost-bucket")
      .upload(filePath, Buffer.from(data, "hex"), {
        contentType: req.file.mimetype,
      });
    if (error) return res.status(500).send({ error: error.message });

    return res
      .status(200)
      .send({ success: true, message: "Files uploaded successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

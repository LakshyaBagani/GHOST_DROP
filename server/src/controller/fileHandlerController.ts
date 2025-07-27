import { Request, Response } from "express";
import crypto from "crypto";
import { decryptContent, encryptContent } from "../utils/manageContent";
import { supabase } from "../config/supabaseconfig";
import prisma from "../config/db";
import { AuthRequest } from "../middlewares/authMiddleware";
import { generateLink } from "../utils/generateLink";
import jwt from "jsonwebtoken";

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    const expireTime = 25;

    if (!req.file) {
      return res.status(401).send({ success: false, message: "No file found" });
    }
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const mimeType = req.file.mimetype;
    const fileName = req.file.originalname;
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

    const { Link, LinkTokenId } = await generateLink(
      hash,
      expireTime,
      iv,
      mimeType
    );

    await prisma.files.create({
      data: {
        iv,
        hash,
        filePath,
        mimeType,
        fileName,
        userId,
        linkId:LinkTokenId
      },
    });

    const reqFileFromDB = await prisma.files.findFirst({
      where: { iv },
    });

    const userLink = await prisma.link.findFirst({
      where: { tokenId: LinkTokenId },
    });

    return res.status(200).send({
      success: true,
      message: "Files uploaded successfully",
      FileName: fileName,
      Link: Link,
      createdAt: reqFileFromDB?.createdAt,
      status: userLink?.used,
      iv: iv,
      tokenId: LinkTokenId,
      type:mimeType
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return res.status(401).send({ success: false, message: "Invalid link" });
    }

    const decode = jwt.verify(token, process.env.MY_SERCET_KEY!) as {
      tokenId: string;
      iv: string;
      hash: string;
      mimeType: string;
    };

    const tokenHistory = await prisma.link.findUnique({
      where: { tokenId: decode.tokenId },
    });

    if (!tokenHistory) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid or expired link" });
    }

    if (tokenHistory.used || tokenHistory.expiresAt < new Date()) {
      return res
        .status(401)
        .send({ success: false, message: "Link already used or expired" });
    }

    const ivHex = decode.iv;
    const files = await supabase.storage.from("ghost-bucket").list();
    const fileMeta = files.data!.find((f) => f.name.startsWith(decode.hash));
    if (!fileMeta) return res.status(404).send("Not found");
    const filePath = fileMeta.name;

    const { data, error } = await supabase.storage
      .from("ghost-bucket")
      .download(filePath);
    if (error) return res.status(500).json({ error: error.message });

    const encryptedBuffer = Buffer.from(await data.arrayBuffer());
    const decrypted = decryptContent(ivHex, encryptedBuffer.toString("hex"));

    await prisma.link.update({
      where: { tokenId: decode.tokenId },
      data: { used: true },
    });
    res.setHeader("Content-Type", decode.mimeType);
    res.send(decrypted);
    return res.status(200).send({ success: true });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(401)
        .send({ success: false, message: "Unable to delete the file" });
    }
    await prisma.files.delete({
      where: { id },
    });
    return res.send({ success: true, message: "File deleted" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

export const getActiveStatus = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) {
      return res
        .status(401)
        .send({ success: false, message: "Unable to fetch the file" });
    }
    const file = await prisma.link.findUnique({
      where: { tokenId },
    });
    if(!file){
      return res.status(401).send({success:false , message:"Unable to get the file"})
    }
    const status = file?.used;
    return res.status(200).send({ success: true, status: status });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

export const reinitiliasedFile = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res
        .status(401)
        .send({ success: false, message: "Token ID is required" });
    }

    const file = await prisma.link.findUnique({
      where: { tokenId },
    });

    if (!file) {
      return res
        .status(404)
        .send({ success: false, message: "File not found" });
    }

    const updatedFile = await prisma.link.update({
      where: { tokenId },
      data: { used: !file.used },
    });

    return res.status(200).send({ success: true, updatedFile: updatedFile });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

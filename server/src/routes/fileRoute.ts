import express from "express"
import { uploadFile } from "../controller/fileHandlerController";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
router.post('/upload' , upload.single("file") , uploadFile)

export default router
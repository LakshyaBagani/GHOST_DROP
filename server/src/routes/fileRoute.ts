import express from "express"
import { getFiles, uploadFile } from "../controller/fileHandlerController";
import multer from "multer";
import authProtect from "../middlewares/authMiddleware";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
router.post('/upload' , authProtect , upload.single("file") , uploadFile)
router.get('/content' , getFiles)

export default router
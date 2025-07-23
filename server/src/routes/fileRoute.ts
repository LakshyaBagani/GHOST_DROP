import express from "express"
import { getFiles, uploadFile } from "../controller/fileHandlerController";
import multer from "multer";
import authProtect from "../middlewares/authMiddleware";
import { getAllFiles } from "../controller/userFileController";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
router.post('/upload' , authProtect , upload.single("file") , uploadFile)
router.get('/content' , getFiles)
router.get('/allfiles' , authProtect , getAllFiles)

export default router
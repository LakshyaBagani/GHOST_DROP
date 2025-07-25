"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reinitiliasedFile = exports.getActiveStatus = exports.deleteFile = exports.getFiles = exports.uploadFile = void 0;
const crypto_1 = __importDefault(require("crypto"));
const manageContent_1 = require("../utils/manageContent");
const supabaseconfig_1 = require("../config/supabaseconfig");
const db_1 = __importDefault(require("../config/db"));
const generateLink_1 = require("../utils/generateLink");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const hash = crypto_1.default
            .createHash("sha256")
            .update(req.file.buffer)
            .digest("hex");
        const { iv, data } = (0, manageContent_1.encryptContent)(req.file.buffer);
        const filePath = `${hash}_${req.file.originalname}`;
        const { error } = yield supabaseconfig_1.supabase.storage
            .from("ghost-bucket")
            .upload(filePath, Buffer.from(data, "hex"), {
            contentType: mimeType,
        });
        if (error)
            return res.status(500).send({ error: error.message });
        yield db_1.default.files.create({
            data: {
                iv,
                hash,
                filePath,
                mimeType,
                fileName,
                userId,
            },
        });
        const reqFileFromDB = yield db_1.default.files.findFirst({
            where: { iv },
        });
        const { Link, LinkTokenId } = yield (0, generateLink_1.generateLink)(hash, expireTime, iv, mimeType);
        const userLink = yield db_1.default.link.findFirst({
            where: { tokenId: LinkTokenId },
        });
        return res.status(200).send({
            success: true,
            message: "Files uploaded successfully",
            FileName: fileName,
            Link: Link,
            createdAt: reqFileFromDB === null || reqFileFromDB === void 0 ? void 0 : reqFileFromDB.createdAt,
            status: userLink === null || userLink === void 0 ? void 0 : userLink.used,
            iv: iv,
            tokenId: LinkTokenId,
            type: mimeType
        });
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
});
exports.uploadFile = uploadFile;
const getFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(401).send({ success: false, message: "Invalid link" });
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.MY_SERCET_KEY);
        const tokenHistory = yield db_1.default.link.findUnique({
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
        const files = yield supabaseconfig_1.supabase.storage.from("ghost-bucket").list();
        const fileMeta = files.data.find((f) => f.name.startsWith(decode.hash));
        if (!fileMeta)
            return res.status(404).send("Not found");
        const filePath = fileMeta.name;
        const { data, error } = yield supabaseconfig_1.supabase.storage
            .from("ghost-bucket")
            .download(filePath);
        if (error)
            return res.status(500).json({ error: error.message });
        const encryptedBuffer = Buffer.from(yield data.arrayBuffer());
        const decrypted = (0, manageContent_1.decryptContent)(ivHex, encryptedBuffer.toString("hex"));
        yield db_1.default.link.update({
            where: { tokenId: decode.tokenId },
            data: { used: true },
        });
        res.setHeader("Content-Type", decode.mimeType);
        res.send(decrypted);
        return res.status(200).send({ success: true });
    }
    catch (error) {
        return res.status(500).send({ success: false, message: error });
    }
});
exports.getFiles = getFiles;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { iv } = req.body;
        if (!iv) {
            return res
                .status(401)
                .send({ success: false, message: "Unable to delete the file" });
        }
        yield db_1.default.files.delete({
            where: { iv },
        });
        return res.send({ success: true, message: "File deleted" });
    }
    catch (error) {
        return res.status(500).send({ success: false, message: error });
    }
});
exports.deleteFile = deleteFile;
const getActiveStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenId } = req.body;
        if (!tokenId) {
            return res
                .status(401)
                .send({ success: false, message: "Unable to fetch the file" });
        }
        const file = yield db_1.default.link.findUnique({
            where: { tokenId },
        });
        const status = file === null || file === void 0 ? void 0 : file.used;
        return res.status(200).send({ success: true, status: status });
    }
    catch (error) {
        return res.status(500).send({ success: false, message: error });
    }
});
exports.getActiveStatus = getActiveStatus;
const reinitiliasedFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenId } = req.body;
        if (!tokenId) {
            return res
                .status(401)
                .send({ success: false, message: "Token ID is required" });
        }
        const file = yield db_1.default.link.findUnique({
            where: { tokenId },
        });
        if (!file) {
            return res
                .status(404)
                .send({ success: false, message: "File not found" });
        }
        const updatedFile = yield db_1.default.link.update({
            where: { tokenId },
            data: { used: !file.used },
        });
        return res.status(200).send({ success: true, updatedFile: updatedFile });
    }
    catch (error) {
        return res.status(500).send({ success: false, message: error });
    }
});
exports.reinitiliasedFile = reinitiliasedFile;

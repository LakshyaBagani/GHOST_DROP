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
exports.getFiles = exports.uploadFile = void 0;
const crypto_1 = __importDefault(require("crypto"));
const manageContent_1 = require("../utils/manageContent");
const supabaseconfig_1 = require("../config/supabaseconfig");
const db_1 = __importDefault(require("../config/db"));
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(401).send({ success: false, message: "No file found" });
        }
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const mimeType = req.file.mimetype;
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
        const newFile = yield db_1.default.files.create({
            data: {
                iv,
                hash,
                filePath,
                mimeType,
                fileName: req.file.originalname,
                userId
            },
        });
        return res
            .status(200)
            .send({ success: true, message: "Files uploaded successfully", userId: userId });
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
});
exports.uploadFile = uploadFile;
const getFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const hash = req.params.hash;
        const files = yield supabaseconfig_1.supabase.storage.from("ghost-bucket").list();
        const requireFile = (_a = files.data) === null || _a === void 0 ? void 0 : _a.find((f) => f.name.startsWith(hash));
        if (!requireFile)
            return res.status(404).send("Not found");
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
});
exports.getFiles = getFiles;

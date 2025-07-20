"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptContent = exports.encryptContent = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encryptContent = (buffer) => {
    const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const IV_LENGTH = 16;
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return { iv: iv.toString("hex"), data: encrypted.toString("hex") };
};
exports.encryptContent = encryptContent;
const decryptContent = (ivHex, encryptedHex) => {
    const iv = Buffer.from(ivHex, "hex");
    const encryptedBuffer = Buffer.from(encryptedHex, "hex");
    const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", process.env.ENCRYPTION_KEY, iv);
    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
};
exports.decryptContent = decryptContent;

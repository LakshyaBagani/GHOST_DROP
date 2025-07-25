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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authProtect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ success: false, message: "Unauthorized: No token provided" });
        }
        const token = authHeader.split(" ")[1];
        if (!process.env.MY_SERCET_KEY) {
            console.error("JWT key is not defined in environment variables");
            throw new Error("JWT secret key undefined");
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.MY_SERCET_KEY);
        req.userId = decode.userId;
        next();
    }
    catch (error) {
        res.status(401).send({ success: false, message: "Invalid or expired token" });
    }
});
exports.default = authProtect;

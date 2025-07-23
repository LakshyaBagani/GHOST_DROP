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
exports.getAllFiles = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAllFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).send({ success: false, messsage: "User not found" });
        }
        const files = yield db_1.default.files.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });
        if (files.length == 0) {
            return res.status(401).send({ success: false, message: "No files found" });
        }
        return res.status(200).send({ success: true, files });
    }
    catch (error) {
        return res.status(500).send({ success: false, message: error });
    }
});
exports.getAllFiles = getAllFiles;

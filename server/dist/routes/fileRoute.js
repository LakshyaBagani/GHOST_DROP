"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileHandlerController_1 = require("../controller/fileHandlerController");
const multer_1 = __importDefault(require("multer"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = express_1.default.Router();
router.post('/upload', authMiddleware_1.default, upload.single("file"), fileHandlerController_1.uploadFile);
exports.default = router;

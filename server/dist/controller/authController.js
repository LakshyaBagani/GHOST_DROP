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
exports.Logout = exports.Login = exports.Signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../config/db"));
const token_1 = __importDefault(require("../utils/token"));
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield db_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res
                .status(409)
                .send({ success: false, message: "User already exists" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield db_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        const token = yield (0, token_1.default)(newUser.id, res);
        return res.status(200).send({
            success: true,
            message: "User created successfully",
            token,
            user: { name: newUser.name, email: newUser.email },
        });
    }
    catch (error) {
        return res.status(500).send({ success: false, message: error });
    }
});
exports.Signup = Signup;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res
                .status(404)
                .send({ success: false, message: "User does not exists" });
        }
        const verifyPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!verifyPassword) {
            return res
                .status(401)
                .send({ success: false, message: "Password does not match" });
        }
        const token = yield (0, token_1.default)(user.id, res);
        return res.status(200).send({
            success: true,
            message: "User logged in successfully",
            token,
            user: { email: user.email },
        });
    }
    catch (error) {
        return res.status(500).send({ success: false, message: error });
    }
});
exports.Login = Login;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("jwt");
        return res.status(200).send({ success: true, message: "User log out successfully" });
    }
    catch (error) {
        return res.status(500).send({ success: false, message: error });
    }
});
exports.Logout = Logout;

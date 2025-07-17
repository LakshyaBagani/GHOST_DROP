import express from "express"
import { Login, Logout, Signup } from "../controller/authController";

const router = express.Router();

router.post('/login' , Login);
router.post('/signup' , Signup);
router.post('/logout' , Logout)

export default router
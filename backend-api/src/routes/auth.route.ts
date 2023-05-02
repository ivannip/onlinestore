import express, {Request, Response, NextFunction} from 'express';
import { verifyToken } from "../middlewares/verifyToken.middleware"
import { authController } from '../controllers/auth.controller';

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/verifyLogin", authController.verifyLogin);

router.get("/logout", authController.logout)


export default router
import { Router } from "express";
import  * as authController from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/authenticate.js"
import passport from "passport";
const authRouter = Router();

authRouter.post("/login", authController.login);

authRouter.post("/register", authController.register);
authRouter.get("/logout", authController.logout);
authRouter.get("/me", authController.identify )

export default authRouter;
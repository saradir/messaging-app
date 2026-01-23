import { Router } from "express";
import  * as authController from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/authenticate.js"
const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authenticateUser, authController.identify )
export default authRouter;
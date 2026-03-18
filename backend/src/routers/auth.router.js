import { Router } from "express";
import  * as authController from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/authenticate.js"
import passport from "passport";
import { registrationValidator } from "../validators/auth.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
const authRouter = Router();

authRouter.post("/login", authController.login);

authRouter.post("/register", registrationValidator, handleValidationErrors, authController.register);
authRouter.get("/logout", authController.logout);
authRouter.get("/me", authController.identify )

export default authRouter;
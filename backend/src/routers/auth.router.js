import { Router } from "express";
import  * as authController from "../controllers/auth.controller.js";
import { loginValidator, registrationValidator } from "../validators/auth.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
const authRouter = Router();

authRouter.post("/login", loginValidator, handleValidationErrors, authController.login);

authRouter.post("/register", registrationValidator, handleValidationErrors, authController.register);
authRouter.post("/logout", authController.logout);
authRouter.post("/guest", authController.loginAsGuest);
authRouter.get("/me", authController.identify )

export default authRouter;
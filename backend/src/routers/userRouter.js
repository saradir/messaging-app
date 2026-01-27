import { Router } from "express";

const userRouter = Router();

userRouter.get("/:userId", userController.show);

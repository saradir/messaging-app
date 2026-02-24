import { Router } from "express";
import * as messagesController from "../controllers/messages.js";

const  messagesRouter = Router({ mergeParams: true });

messagesRouter.get("/", messagesController.index);
messagesRouter.post("/", messagesController.create);

export default messagesRouter;
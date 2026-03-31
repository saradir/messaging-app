import { Router } from "express";
import * as messagesController from "../controllers/messages.js";
import { validateCreateMessage, validateIndexMessages } from "../validators/conversations.js";

const  messagesRouter = Router({ mergeParams: true });

messagesRouter.get("/", validateIndexMessages, messagesController.index);
messagesRouter.post("/", validateCreateMessage, messagesController.create);

export default messagesRouter;
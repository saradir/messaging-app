import { Router } from "express";
import * as messagesController from "../controllers/messages.js";
import { validateCreateMessage, validateIndexMessages } from "../validators/conversations.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
const  messagesRouter = Router({ mergeParams: true });

messagesRouter.get("/", validateIndexMessages, handleValidationErrors, messagesController.index);
messagesRouter.post("/", validateCreateMessage, handleValidationErrors, messagesController.create);

export default messagesRouter;
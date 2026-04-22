import { Router } from "express";
import * as conversationController from "../controllers/conversations.js";
import messagesRouter from "./messages.js";
import { requireAuth } from "../middlewares/authenticate.js";
import { validateStartConversation, validateUpdateLastSeenMessage } from "../validators/conversations.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";

const conversationsRouter = Router();

conversationsRouter.use("/", requireAuth);
conversationsRouter.post("/", validateStartConversation, handleValidationErrors, conversationController.startConversation);
conversationsRouter.get("/", conversationController.index)
conversationsRouter.patch("/conversationId/lastSeen", validateUpdateLastSeenMessage, handleValidationErrors, conversationController.updateLastSeenMessage);
conversationsRouter.use("/:conversationId/messages", messagesRouter)

export default conversationsRouter;
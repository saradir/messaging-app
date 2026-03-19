import { Router } from "express";
import * as conversationController from "../controllers/conversations.js";
import messagesRouter from "./messages.js";
const conversationsRouter = Router();

conversationsRouter.post("/", conversationController.startConversation);
conversationsRouter.get("/", conversationController.index)
conversationsRouter.use("/:conversationId/messages", messagesRouter)

export default conversationsRouter;
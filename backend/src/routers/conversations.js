import { Router } from "express";
import * as conversationController from "../controllers/conversations";
import messagesRouter from "./messages";
const conversationsRouter = Router();

conversationsRouter.post("/", conversationController.startConversation);
conversationsRouter.use("/:conversationId/messages", messagesRouter)

export default conversationsRouter;
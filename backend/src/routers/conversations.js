import { Router } from "express";
import * as conversationController from "../controllers/conversations.js";
import messagesRouter from "./messages.js";
import { requireAuth } from "../middlewares/authenticate.js";
import { validateStartConversation } from "../validators/conversations.js";
const conversationsRouter = Router();

conversationsRouter.use("/", requireAuth);
conversationsRouter.post("/", validateStartConversation, conversationController.startConversation);
conversationsRouter.get("/", conversationController.index)
conversationsRouter.use("/:conversationId/messages", messagesRouter)

export default conversationsRouter;
import { body, query, param } from "express-validator"


export const validateStartConversation = [
    body("targetUserId")
        .exists().withMessage("contactId is required")
        .isInt().withMessage("contactId must be a number")
        .toInt(),
]

export const validateCreateMessage = [
    param("conversationId")
        .exists().withMessage("conversationId is required")
        .isInt().withMessage("conversationId must be a number")
        .toInt(),
]

export const validateIndexMessages = [
    param("conversationId")
        .exists().withMessage("conversationId is required")
        .isInt().withMessage("conversationId must be a number")
        .toInt(),
]
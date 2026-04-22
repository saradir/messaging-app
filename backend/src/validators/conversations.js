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

    body("content")
        .trim()
        .notEmpty().withMessage("Message cannot be empty")
        .isLength({ min: 1, max: 2000 })
        .withMessage("Message must be between 1 and 2000 characters"),

    body("clientId")
        .exists().withMessage("clientId is required")
]

export const validateIndexMessages = [
    param("conversationId")
        .exists().withMessage("conversationId is required")
        .isInt().withMessage("conversationId must be a number")
        .toInt(),
]

export const validateUpdateLastSeenMessage = [
    param("conversationId")
        .exists().withMessage("conversationId is required")
        .isInt().withMessage("conversationId must be a number")
        .toInt(),

    body("messageId")
        .exists().withMessage("messageId is required")
        .isInt().withMessage("messageId must be a number")
        .toInt(),
]
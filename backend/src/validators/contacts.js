import { body, query } from "express-validator"


export const validateSearchQuery = [
    query("q")

        .exists().withMessage("Query missing")
        .trim()
        .notEmpty().withMessage("Query cannot be empty")
        .isLength({min:3, max:50})
    ,
]

export const validateAddRemoveContact = [

    body("contactId")
        .exists().withMessage("contactId is required")
        .isInt().withMessage("contactId must be a number")
        .toInt(),

]


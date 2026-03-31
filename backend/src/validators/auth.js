import { body } from "express-validator"
import prisma from "../config/prisma.js";

const PASSWORD_REGEX = /^[a-zA-Z0-9_!@#$%^&*()+?.-]{4,20}$/;

export const registrationValidator = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .normalizeEmail()
        .isEmail().withMessage("Invalid email")
        .bail()
        .custom(async (email) => {
            const isUnique = await confirmUnique("email", email);
            if(!isUnique) throw new Error("Email already exists");
        }),

    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .matches(/^[a-zA-Z0-9_-]{4,20}$/).withMessage("Username must be 4–20 characters and contain only letters, numbers, or _")
        .toLowerCase()
        .bail()
        .custom(async (username) => {
            const isUnique = await confirmUnique("username", username);
            if(!isUnique) throw new Error("Username already exists");
        }),
    
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .matches(PASSWORD_REGEX)
        .withMessage("Password must be 4–20 characters")
        ,
    body("confirmPassword")
        .trim()
        .notEmpty().withMessage("Missing value").bail()
        .custom( (pass, {req} ) =>{
            if (pass !== req.body.password) throw new Error("Passwords must match")
            return true;
        }),
]

export const loginValidator = [
    body("email")
        .notEmpty().withMessage("Password is required")
        .normalizeEmail()
        .isEmail().withMessage("Invalid email"),

    body("password")
        .notEmpty().withMessage("Password is required")
]

async function confirmUnique(field, value){
    const user = await prisma.user.findUnique({
        where:{
            [field]: value
        }
    });

    return !user
}
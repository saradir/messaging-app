import { body } from "express-validator"
import prisma from "../config/prisma.js";

export const registrationValidator = [
    body("email")
        .normalizeEmail()
        .isEmail()
        .withMessage("Invalid email")
        .bail()
        .custom(async (email) => {
            const isUnique = await confirmUnique("email", email);
            if(!isUnique) throw new Error("Email already exists");
        }),

    body("username")
        .trim()
        .matches(/^[a-zA-Z0-9_]{4,20}$/)
        .toLowerCase()
        .withMessage("Username must be 4–20 characters and contain only letters, numbers, or _")
        .bail()
        .custom(async (username) => {
            const isUnique = await confirmUnique("username", username);
            if(!isUnique) throw new Error("Username already exists");
        }),
    
    body("password")
        .trim()
        .matches(/^[a-zA-Z0-9_!@#$%^&*()-+?.]{4,20}$/)
        .withMessage("Password must be 4–20 characters")
        ,
    body("confirmPassword")
        .trim()
        .notEmpty()
        .custom( (pass, {req} ) =>{
            if (pass !== req.body.password) throw new Error("Passwords must match")
        }),
]

export 

async function confirmUnique(field, value){
    const user = await prisma.user.findUnique({
        where:{
            [field]: value
        }
    });

    return !user
}
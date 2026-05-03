import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import { matchedData } from "express-validator";


export async function register(req, res, next){

    const data = matchedData(req);
    const { email, username, password} = data;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data:{
                email,
                username,
                hashedPassword
            },
            select:{
                id: true,
                username: true,
                email: true
            }
        });

        // Add demo contact to all new users
        await prisma.contact.create({
            data:{
                ownerId: user.id,
                contactId: 0
            }
        });

        return res.status(201).json({
        success: true,
        data: user
        });
    }catch (err){
        next(err);
    }
}

export  function login(req, res, next){

    passport.authenticate("local", (err, user, info) => {
        if (err) {
        return next(err);
        }

        if(!user) return res
        .set("Cache-Control", "no-store")
        .status(401).json({
            success: false, message: "Invalid Credentials"
        });
    

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
        return res
        .set("Cache-Control", "no-store")
        .json({
            success: true,
            user
        });
    });
    })(req, res, next);
}

export function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid");

      return res
        .set("Cache-Control", "no-store")
        .status(200)
        .json({ success: true });
    });
  });
}

export function identify(req, res, next){

    if(!req.user) return res.status(401).json({
        success:false, message: "Operation failed"
    });
    return res
    .set("Cache-Control", "no-store")
    .status(200).json(req.user);
}
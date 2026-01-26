import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import passport from "passport";


export async function register(req, res, next){
    // presumably after verification and confirming uniqueness in a separate middleware

    const email = req.body.email // confirm unique
    const username = req.body.username; // confirm unique 
    const password = req.body.password; 

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const users = await prisma.user.findMany();
        const user = await prisma.user.create({
            data:{
                email,
                username,
                hashedPassword
            }
        });
        console.log(user);
        // TODO: return sanitzed user object
        return res.status(201).json({
        success: true
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

        if(!user) return res.status(401).json({
            success: false, message: "Invalid Credentials"
        });
    

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
        return res.json({
            success: true,
            user
        });
    });
    })(req, res, next);
}




export function logout(req, res, next){
    req.logout((err) => {
        if(err){
            return next(err);
        }
    return res.status(200).json({
        success: true
    });
    });
}

export function identify(req, res, next){
    //TODO: sanitize user
    if(!req.user) return res.status(401).json({
        success:false, message: "Operation failed"
    });
    return res.status(200).json(req.user);
}
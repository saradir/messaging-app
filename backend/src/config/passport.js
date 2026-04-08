import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from "./prisma.js";
import bcrypt from "bcryptjs";

passport.use(
    new LocalStrategy( { usernameField: "email", passwordField: "password" }, 
        async (username, password, done) => {
        try{
            const user = await prisma.user.findUnique({
                where: {
                    email: username
                }
            });
                
        if(!user){
            return done(null, false, {message: "Incorrect username"});
        }

        const match = await bcrypt.compare(password, user.hashedPassword);
        if(!match){
            return done(null, false, { message: "Incorrect Password"});
        }

        return done(null, user);
    } catch(err) {
        return done(err);
    }

    })
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
        where:{
            id
        },
        select: {
            id: true,
            email: true,
            username: true,
        }
    });


    if (!user) return done(null, false);
    done(null, user);

  } catch(err) {
    done(err);
  }
});

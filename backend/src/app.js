import express from "express";
import cors from "cors";
import 'dotenv/config';
import { corsOptions } from "./config/cors-options.js";
import session from "express-session";
import authRouter  from "./routers/auth.router.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import './config/passport.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(session({ secret: "secret", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) =>{
    res.json({
        message: "Welcome"
    });
})

app.use("/api/auth", authRouter);
console.log("allowed:",process.env.CORS_ORIGINS)


app.listen(PORT, () => console.log(`Server started on ${PORT}`));

export default app;
import express from "express";
import cors from "cors";
import 'dotenv/config';
import { corsOptions } from "./config/cors-options.js";
import authRouter  from "./routers/auth.router.js";
import conversationsRouter from "./routers/conversations.js";
import contactsRouter from "./routers/contacts.js"
import { createServer } from "http";
import cookieParser from "cookie-parser";
import passport from './config/passport.js';
import { sessionMiddleware } from "./config/session.js";
import { initSocket, registerSocketHandlers } from "./config/socket.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.set("trust proxy", 1); // make sure express doesn't block cloud host's cookie because of proxy header
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) =>{
    res.json({
        message: "Welcome"
    });
})

app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/contacts", contactsRouter);


app.use((err, req, res, next) => {
    console.error(err);

    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Resource not found"
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

const httpServer = createServer(app);
const io = initSocket(httpServer);

registerSocketHandlers(io);

httpServer.listen(PORT,  () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
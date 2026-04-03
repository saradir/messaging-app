import express from "express";
import cors from "cors";
import 'dotenv/config';
import { corsOptions } from "./config/cors-options.js";
import session from "express-session";
import authRouter  from "./routers/auth.router.js";
import conversationsRouter from "./routers/conversations.js";
import contactsRouter from "./routers/contacts.js"
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import passport from "passport";
import './config/passport.js';
import { registerSocketHandlers } from "./config/socket.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

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
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
registerSocketHandlers(io);


httpServer.listen(PORT);
export default app;
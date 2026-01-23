import express from "express";
import cors from "cors";
import 'dotenv/config';
import { corsOptions } from "./config/cors-options.js";
import authRouter  from "./routers/auth.router.js";"./routers/auth.router.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) =>{
    res.json({
        message: "Welcome"
    });
})

app.use("/api/auth", authRouter);


app.listen(PORT, () => console.log(`Server started on ${PORT}`));

export default app;
// auth.test.js
 
import authRouter from "../routers/auth.router.js";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "../config/passport.js";

const app = express();


const agent = request.agent(app);
app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: "test-secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRouter);

// error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    name: err.name,
    code: err.code,     
  });
});
const randomPrefix = crypto.randomUUID();
const email = `${randomPrefix}-test@test.com`
const username = `${randomPrefix}-test_user`
const password = "1234"

test("auth flow works", async () => {

  await agent
    .post("/api/auth/register")
    .send({ email, username, password })
    .expect(201);

  await agent
    .post("/api/auth/login")
    .send({ email, password })
    .expect(200);

  await agent
    .get("/api/auth/me")
    .expect(200)
    .expect(res => {
      expect(res.body.username).toBe(username);
    });
});



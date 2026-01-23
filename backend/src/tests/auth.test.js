// auth.test.js
 
import authRouter from "../routers/auth.router.js";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";


const app = express();


const agent = request.agent(app);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);

const email = "test@test.com"
const username = "test_user"
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


/*
test("registration works", () => {
   return agent
    .post("/api/auth/register")
    .type("json")
    .send({ email: "test@test.com", username: "test_user", password: "1234"})
    .expect(201)
    .expect({success: true})
    
});

test("login works", () => {
    return agent
    .post("/api/auth/login")
    .type("json")
    .send({email: "test@test.com", password: "1234" })
    .expect(200)
});

test("identification works", () => {
    return agent
    .get("/api/auth/identify")
    .expect(200)
    .expect(user)
})
    */
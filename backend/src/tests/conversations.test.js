import { createUser, resetDb, testAuth } from "./utils";
import request from "supertest";
import express from "express";
import prisma from "../config/prisma";
import conversationsRouter from "../routers/conversations";
const app = express();
const agent = request.agent(app);
app.use(express.json());

app.use(testAuth);
app.use("/api/conversations", conversationsRouter);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: err.message,
    name: err.name,
    code: err.code,     
  });
});

let userA = await createUser();
let userB = await createUser();
let convId;
describe("Test conversations router", () => {
    afterAll(async () => {
        await resetDb();
        await prisma.$disconnect();
    });
    
    test("create conversation", async () =>{
        const res = await agent
        .post("/api/conversations")
        .set("x-test-user-id", userA.id)
        .send({targetUserId: userB.id})
        .expect(200);


        expect(res.body).toHaveProperty("data.id");
        convId = res.body.data.id;
    });

    test("send message", async () =>{
        await agent
        .post(`/api/conversations/${convId}/messages`)
        .set("x-test-user-id", userA.id)
        .send({content: "This is a test message"})
        .expect(201);
    });

    test("fetch conversations as userB", async () => {
        const res = await agent
        .get("/api/conversations")
        .set("x-test-user-id", userB.id)
        .expect(200);
        
        expect(res.body.data.length).toBeGreaterThan(0)

    });
    
});

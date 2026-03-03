import request from "supertest";
import express from "express";
import prisma from "../config/prisma";
import conversationsRouter from "../routers/conversations";

const app = express();
const agent = request.agent(app);
app.use(express.json());
const testAuth =  async (req, res, next) => {
    const id = Number(req.headers["x-test-user-id"]);
    req.user = { id }
    next();
    }
app.use(testAuth);
app.use("/api/conversations", conversationsRouter);

describe("Vertical Slice", () =>{

    let userA, userB;
    afterAll(async () => {
        await prisma.$disconnect();
    });
    beforeAll(async () => {
        await prisma.message.deleteMany();
        await prisma.membership.deleteMany();
        await prisma.conversation.deleteMany();
        await prisma.user.deleteMany();
        userA = await prisma.user.create({
            data: {
                    email: `userA@test.com`,
                    username: 'userA',
                    hashedPassword: '1234'
                },

        });
        userB = await prisma.user.create({
            data:{
                    email: 'userB@test.com',
                    username: 'userB',
                    hashedPassword: '1234'
            }
        });
    });



    test('happy path', async() =>{

        // Start conversation
        const res = await agent
        .post("/api/conversations")
        .set("x-test-user-id", userA.id)
        .send({targetUserId: userB.id})
        .expect(200);


        expect(res.body).toHaveProperty("data.id");
        const convId = res.body.data.id;

        // Send message
        await agent
        .post(`/api/conversations/${convId}/messages`)
        .set("x-test-user-id", userA.id)
        .send({content: "This is a test message"})
        .expect(201);


    });
});
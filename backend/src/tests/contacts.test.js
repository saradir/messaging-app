// This test suite deals for the most part with authorization and validation

import { createUser, resetDb, testAuth } from "./utils";
import request from "supertest";
import express from "express";
import prisma from "../config/prisma";
import contactsRouter from "../routers/contacts";
const app = express();
const agent = request.agent(app);


app.use(express.json());
app.use(testAuth);
app.use("/api/contacts", contactsRouter);
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


describe("Test contacts router", () => {
    afterAll(async () =>{
            await prisma.$disconnect();
    });

    test("deny unauthorized", async () => {
      await agent
        .get("/api/contacts")
        .expect(401);

    });

    test("reject invalid contactId field", async () =>{
      await agent
        .post("/api/contacts/")
        .set("x-test-user-id", userA.id)
        .send({contactId: "wrongId"})
        .expect(400);
    });

    test("add user", async () => {
      await agent
        .post("/api/contacts/")
        .set("x-test-user-id", userA.id)
        .send({contactId: userB.id})
        .expect(200);
    });


    test("ignore adding existing contact", async () => {
      await agent
        .post("/api/contacts/")
        .set("x-test-user-id", userA.id)
        .send({contactId: userB.id})
        .expect(200);
    });

    test("remove contact", async () => {
      await agent
        .delete(`/api/contacts/${userB.id}`)
        .set("x-test-user-id", userA.id)
        .expect(204)
    })

})

    


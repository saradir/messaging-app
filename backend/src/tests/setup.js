// tests/setup.js
import prisma from "../src/config/prisma.js";

async function resetDb() {
  await prisma.message.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.user.deleteMany();
}

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await prisma.$disconnect();
});
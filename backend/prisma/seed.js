import prisma from "../src/config/prisma.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const BOT_USER_ID = 0;

async function main() {
  await prisma.user.upsert({
    where: { id: BOT_USER_ID },
    update: { username: 'DemoBot', email: 'bot@demo.com' },
    create: {
      id: BOT_USER_ID,
      username: 'DemoBot',
      email: 'bot@demo.com',
      hashedPassword: await bcrypt.hash(randomUUID(), 10),
    },
  });
  console.log('✅ System user seeded');

  await prisma.user.upsert({
    where: { email: 'alice@demo.com' },
    update: { username: 'Alice' },
    create: {
      email: 'alice@demo.com',
      username: 'Alice',
      hashedPassword: await bcrypt.hash(randomUUID(), 10),
    },
  });

  await prisma.user.upsert({
    where: { email: 'bob@demo.com' },
    update: { username: 'Bob' },
    create: {
      email: 'bob@demo.com',
      username: 'Bob',
      hashedPassword: await bcrypt.hash(randomUUID(), 10),
    },
  });
  console.log('✅ Demo users seeded');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

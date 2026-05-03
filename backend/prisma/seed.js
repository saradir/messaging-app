import prisma from "../src/config/prisma.js";

const SYSTEM_USER_ID = 0;

async function main() {
  await prisma.user.upsert({
    where: { id: SYSTEM_USER_ID },
    update: {},
    create: {
      id: SYSTEM_USER_ID,
      username: 'DemoBot',
      email: 'demo@yourapp.com',
    },
  });
  console.log('✅ System user seeded');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
import prisma from "../src/config/prisma.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const SYSTEM_USER_ID = 0;

function participantKey(ids) {
  const normalized = [...new Set(ids.map(Number))].sort((a, b) => a - b);
  return normalized.join(":");
}

async function main() {
  await prisma.user.upsert({
    where: { id: SYSTEM_USER_ID },
    update: {},
    create: {
      id: SYSTEM_USER_ID,
      username: 'DemoBot',
      email: 'demo@yourapp.com',
      hashedPassword: await bcrypt.hash(randomUUID(), 10),
    },
  });
  console.log('✅ System user seeded');

  const guest = await prisma.user.upsert({
    where: { email: 'guest@demo.com' },
    update: {},
    create: {
      email: 'guest@demo.com',
      username: 'Guest',
      hashedPassword: await bcrypt.hash(randomUUID(), 10),
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@demo.com' },
    update: {},
    create: {
      email: 'alice@demo.com',
      username: 'Alice',
      hashedPassword: await bcrypt.hash(randomUUID(), 10),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@demo.com' },
    update: {},
    create: {
      email: 'bob@demo.com',
      username: 'Bob',
      hashedPassword: await bcrypt.hash(randomUUID(), 10),
    },
  });
  console.log('✅ Guest and demo users seeded');

  for (const contactId of [0, alice.id, bob.id]) {
    await prisma.contact.upsert({
      where: { ownerId_contactId: { ownerId: guest.id, contactId } },
      update: {},
      create: { ownerId: guest.id, contactId },
    });
  }
  console.log('✅ Guest contacts seeded');

  const convGuestAlice = await prisma.conversation.upsert({
    where: { participantHash: participantKey([guest.id, alice.id]) },
    update: {},
    create: {
      participantHash: participantKey([guest.id, alice.id]),
      memberships: {
        create: [
          { userId: guest.id, role: 'member' },
          { userId: alice.id, role: 'member' },
        ],
      },
    },
  });

  const convGuestBob = await prisma.conversation.upsert({
    where: { participantHash: participantKey([guest.id, bob.id]) },
    update: {},
    create: {
      participantHash: participantKey([guest.id, bob.id]),
      memberships: {
        create: [
          { userId: guest.id, role: 'member' },
          { userId: bob.id, role: 'member' },
        ],
      },
    },
  });
  console.log('✅ Demo conversations seeded');

  const aliceMessages = [
    { clientId: 'seed-alice-1', content: 'Hey! How are you doing?', authorId: guest.id },
    { clientId: 'seed-alice-2', content: "Doing great, thanks! Working on some cool projects lately.", authorId: alice.id },
    { clientId: 'seed-alice-3', content: 'Oh nice, what kind of projects?', authorId: guest.id },
    { clientId: 'seed-alice-4', content: 'Mostly full-stack web stuff. React on the frontend, Node on the backend.', authorId: alice.id },
    { clientId: 'seed-alice-5', content: "Sounds familiar! Let's catch up soon.", authorId: guest.id },
  ];

  for (const msg of aliceMessages) {
    await prisma.message.upsert({
      where: { conversationId_clientId: { conversationId: convGuestAlice.id, clientId: msg.clientId } },
      update: {},
      create: { ...msg, conversationId: convGuestAlice.id },
    });
  }

  const bobMessages = [
    { clientId: 'seed-bob-1', content: 'Bob! Are you free this weekend?', authorId: guest.id },
    { clientId: 'seed-bob-2', content: 'Yeah, what did you have in mind?', authorId: bob.id },
    { clientId: 'seed-bob-3', content: 'Maybe a hike? The weather looks great.', authorId: guest.id },
    { clientId: 'seed-bob-4', content: "I'm in! Saturday works for me.", authorId: bob.id },
  ];

  for (const msg of bobMessages) {
    await prisma.message.upsert({
      where: { conversationId_clientId: { conversationId: convGuestBob.id, clientId: msg.clientId } },
      update: {},
      create: { ...msg, conversationId: convGuestBob.id },
    });
  }
  console.log('✅ Demo messages seeded');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

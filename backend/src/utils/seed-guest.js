import prisma from "../config/prisma.js";
import { participantKey } from "./participant-key.js";

const BOT_USER_ID = 0;
export async function seedGuest(guestId){
    try{

        // Seed contacts
        const alice = await prisma.user.findUnique({
            where: {email: 'alice@demo.com'},        
        });

        const bob = await prisma.user.findUnique({
            where: {email: 'bob@demo.com'}
        });

        await prisma.contact.createMany({
            data: [
                { ownerId: guestId, contactId: BOT_USER_ID },
                { ownerId: guestId, contactId: alice.id },
                { ownerId: guestId, contactId: bob.id },
            ],
        });

        console.log('Seeded contacts');

          const convGuestBot = await prisma.conversation.upsert({
    where: { participantHash: participantKey([guestId, BOT_USER_ID]) },
    update: {},
    create: {
      participantHash: participantKey([guestId, BOT_USER_ID]),
      memberships: {
        create: [
          { userId: guestId, role: 'member' },
          { userId: BOT_USER_ID, role: 'member' },
        ],
      },
    },
  })

  const convGuestAlice = await prisma.conversation.upsert({
    where: { participantHash: participantKey([guestId, alice.id]) },
    update: {},
    create: {
      participantHash: participantKey([guestId, alice.id]),
      memberships: {
        create: [
          { userId: guestId, role: 'member' },
          { userId: alice.id, role: 'member' },
        ],
      },
    },
  });

  const convGuestBob = await prisma.conversation.upsert({
    where: { participantHash: participantKey([guestId, bob.id]) },
    update: {},
    create: {
      participantHash: participantKey([guestId, bob.id]),
      memberships: {
        create: [
          { userId: guestId, role: 'member' },
          { userId: bob.id, role: 'member' },
        ],
      },
    },
  });
  console.log('✅ Demo conversations seeded');

  const aliceMessages = [
    { clientId: 'seed-alice-1', content: 'Hey! How are you doing?', authorId: guestId },
    { clientId: 'seed-alice-2', content: "Doing great, thanks! Working on some cool projects lately.", authorId: alice.id },
    { clientId: 'seed-alice-3', content: 'Oh nice, what kind of projects?', authorId: guestId },
    { clientId: 'seed-alice-4', content: 'Mostly full-stack web stuff. React on the frontend, Node on the backend.', authorId: alice.id },
    { clientId: 'seed-alice-5', content: "Sounds familiar! Let's catch up soon.", authorId: guestId },
  ];

  for (const msg of aliceMessages) {
    await prisma.message.upsert({
      where: { conversationId_clientId: { conversationId: convGuestAlice.id, clientId: msg.clientId } },
      update: {},
      create: { ...msg, conversationId: convGuestAlice.id },
    });
  }

  const bobMessages = [
    { clientId: 'seed-bob-1', content: 'Bob! Are you free this weekend?', authorId: guestId },
    { clientId: 'seed-bob-2', content: 'Yeah, what did you have in mind?', authorId: bob.id },
    { clientId: 'seed-bob-3', content: 'Maybe a hike? The weather looks great.', authorId: guestId },
    { clientId: 'seed-bob-4', content: "I'm in! Saturday works for me.", authorId: bob.id },
  ];

  for (const msg of bobMessages) {
    await prisma.message.upsert({
      where: { conversationId_clientId: { conversationId: convGuestBob.id, clientId: msg.clientId } },
      update: {},
      create: { ...msg, conversationId: convGuestBob.id },
    });
  }

  const botMessages = [
    {clientId: 'seed-bot-1', content: "Hey! I am an AI bot created to help you demo the app. Don't be shy, say hello.", authorId: BOT_USER_ID }
  ]

  for (const msg of botMessages) {
    await prisma.message.upsert({
      where: { conversationId_clientId: { conversationId: convGuestBot.id, clientId: msg.clientId } },
      update: {},
      create: { ...msg, conversationId: convGuestBot.id },
    });
  }


  console.log('✅ Demo messages seeded');

  // Set realistic read state based on who replied to what
  const getMsg = (conversationId, clientId) =>
    prisma.message.findUnique({
      where: { conversationId_clientId: { conversationId, clientId } },
      select: { id: true },
    });

  const [a3, a4, b3] = await Promise.all([
    getMsg(convGuestAlice.id, 'seed-alice-3'),
    getMsg(convGuestAlice.id, 'seed-alice-4'),
    getMsg(convGuestBob.id, 'seed-bob-3'),
  ]);

  // Alice conv: Guest saw a4 before sending a5 (0 unread); Alice replied to a3, a5 is unread for her
  await prisma.membership.update({
    where: { userId_conversationId: { userId: guestId, conversationId: convGuestAlice.id } },
    data: { lastSeenMessageId: a4.id },
  });
  await prisma.membership.update({
    where: { userId_conversationId: { userId: alice.id, conversationId: convGuestAlice.id } },
    data: { lastSeenMessageId: a3.id },
  });

  // Bob conv: Guest sent b3 after seeing b2; b4 is unread for guest (1 unread); Bob replied to b3
  await prisma.membership.update({
    where: { userId_conversationId: { userId: guestId, conversationId: convGuestBob.id } },
    data: { lastSeenMessageId: b3.id },
  });
  await prisma.membership.update({
    where: { userId_conversationId: { userId: bob.id, conversationId: convGuestBob.id } },
    data: { lastSeenMessageId: b3.id },
  });
  console.log('✅ Read state seeded');




  } catch (error){
    throw error;
  }
    
}
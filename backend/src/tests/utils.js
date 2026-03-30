import prisma from "../config/prisma";

export async function createUser(overides = {}){

    const username = crypto.randomUUID();
    const user = await prisma.user.create({
            data: {
                    email: `${username}@test.com`,
                    username,
                    hashedPassword: '1234',
                    ...overides,
                },

        });

    return user;
}


export async function resetDb() {
    await prisma.$transaction([
 
        prisma.message.deleteMany(),
        prisma.membership.deleteMany(),
        prisma.conversation.deleteMany(),
        prisma.user.deleteMany(),
    ]);
}

// Attach user object to req for authorization. Mount on app before routing.
export function testAuth(req, res, next) {
  const rawId = req.headers["x-test-user-id"];

  if (!rawId) {
    return next(); // do nothing if header missing, avoids providing invalid user
  }

  const userId = Number(rawId);

  if (!Number.isInteger(userId)) {
    return next(); // ignore invalid values
  }

  req.user = { id: userId };
  next();
}
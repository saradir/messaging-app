import prisma from "./prisma.js";
export function registerSocketHandlers(io) {
  
    io.on("connection", (socket) => {
      console.log("socket connected", socket.id);

      socket.on("conversation:join", async (conversationId) => {

        const isMember = await prisma.membership.findUnique({
          where:{
            userId_conversationId: {
              userId: socket.request.user.id,
              conversationId: Number(conversationId)
            }
          }
        });

        if(!isMember){
            socket.emit("conversation:join:error", "unauthorized");
            return;
        }

        socket.join(`conversation:${conversationId}`);
        console.log(`user ${socket.request.user.id} joined ${conversationId}`);
      });

  });
}
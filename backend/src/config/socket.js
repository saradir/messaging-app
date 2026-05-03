import prisma from "./prisma.js";
import { Server } from "socket.io";
import { sessionMiddleware } from "./session.js";
import passport from './passport.js';

let ioServer;

export function initSocket(httpServer) {
  ioServer = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGINS,
      credentials: true,
    },
  });
  return ioServer;
}

export function getIO() {

  if (!ioServer) {
    throw new Error("Socket.IO not initialized");
  }
  return ioServer;
}

// Match express middleware to io signature
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);


export function registerSocketHandlers(io) {


  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.session()));


  io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
  });
  
  io.on("connection", (socket) => {
    const userId = socket.request.user.id;
    console.log("socket connected", socket.id);
    socket.join(`user:${socket.request.user.id}`);

    
    socket.on("conversation:join", async (conversationId) => {
      
      const user = socket.request.user;

      if (!user) {
        socket.emit("conversation:join:error", "unauthenticated");
        return;
      }

      const membership = await prisma.membership.findUnique({
        where:{
          userId_conversationId: {
            userId: user.id,
            conversationId: Number(conversationId)
          }
        }
      });

      if(!membership){
          socket.emit("conversation:join:error", "unauthorized");
          return;
      }

      socket.join(`conversation:${conversationId}`);
      console.log(`user ${socket.request.user.id} joined ${conversationId}`);
    });


});
}
import prisma from "../config/prisma.js";
import { matchedData } from "express-validator";
import { getIO } from "../config/socket.js"; 
import { formatMessage } from "../utils/payload-format.js";

export async function create(req, res, next){

    const { conversationId, content, clientId } = matchedData(req);
    const io = getIO();

    //Authorize
    try{
        const membership = await prisma.membership.findUnique({
            where: {
                userId_conversationId: {userId: req.user.id, conversationId}
            }
        });

        if(!membership){
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const message = await prisma.message.create({
            data:{
                authorId: req.user.id,
                content,
                conversationId,
                clientId
            },
            include: {
                conversation: {
                    select: {
                        id: true,
                        participantHash: true,
                        updatedAt: true,
                        memberships: {
                            select: {
                                user: {select: {id: true, username: true}},
                                role: true,
                                lastSeenMessageId: true
                            },
                        },                    
                        messages: {
                            select: { id: true, createdAt: true, authorId: true, content: true },
                            orderBy: {createdAt: "desc"},
                            take: 1
                        },
                        _count: {
                            select: {messages: true}
                        }
                    },
                }
            }
        });
        const payload = formatMessage(message);

        // If this is the first message in the conversation, emit new conversation event
        if(message.conversation._count.messages === 1){
            const participantMemberships = message.conversation.memberships.map(pm => ({
                conversationId: message.conversation.id,
                userId: pm.user.id,
                username: pm.user.username,
                role: pm.role,
                lastSeenMessageId: pm.lastSeenMessageId,
            }));
            message.conversation.memberships.forEach(m =>{
                if(m.user.id === req.user.id) return;
                const conversationPayload = {
                    userId: m.user.id,
                    conversationId: message.conversation.id,
                    lastMessage: message.conversation.messages[0] ?? null,
                    lastSeenMessageId: m.lastSeenMessageId,
                    unreadCount: 1,
                    participantMemberships,
                };
                io.to(`user:${m.user.id}`).emit("conversation:new", conversationPayload);
                console.log(`User ${m.user.id} has been notified of new conversation`);
            })
        }else{
            message.conversation.memberships.forEach(m =>{
                io.to(`user:${m.user.id}`).emit("message:new", payload);
                console.log(`message sent to room: ${m.user.id}`);
            })
        }
        
        return res.status(201).json({
            success: true,
            data: payload
        })
    }catch(err){
        next(err);
    }
}

// Fetch messsages by conversation ID
export async function index(req, res, next){


const limit = Math.min(Number(req.query.limit) || 50, 100);
const { conversationId } = matchedData(req);
    try{
        //Authorize
        const membership = await prisma.membership.findUnique({
            where: {
                userId_conversationId: {userId: req.user.id, conversationId}
            }
        });

        if(!membership){
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

         const messages = await prisma.message.findMany({
            where: {
                conversationId
            },

            orderBy: { createdAt: "desc" },
            take: limit
         })

         return res.status(200).json({
            success: true,
            data: messages.reverse()
         });
    } catch(err){
        next(err);
    }  
}
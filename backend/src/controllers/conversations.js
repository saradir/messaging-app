import prisma from "../config/prisma.js";
import { matchedData } from "express-validator";
import { getIO } from "../config/socket.js"; 


// Fetch all conversations of current user
export async function index(req, res, next){

    try {
        const memberships = await prisma.membership.findMany({
            where: {
                userId: req.user.id
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
                    },
                    
                }
            },
            orderBy: { conversation: { updatedAt: "desc" } }
            
        });


        const conversations = memberships.map(m => {
            const c = m.conversation;
            return{
                id: c.id,
                updatedAt: c.updatedAt,
                lastMessage: c.messages[0] ?? null,
                partners: c.memberships
                        .filter(mm => mm.user.id !== req.user.id)
                        .map(mm => mm.user),
                memberships: c.memberships
                .map((mm) => ({
                    id: mm.user.id,
                    username: mm.user.username,
                    role: mm.role,
                    lastSeenMessageId: mm.lastSeenMessageId, 
                    })),                
            };
        });
                
        return res.status(200).json({
            success: true,
            data: conversations
        })
    } catch (err) {
        next(err);    
    }
}

// Fetch existing conversation or create new one if doesn't exist
export async function startConversation(req, res, next){

    const { targetUserId } = matchedData(req);

    if (targetUserId === req.user.id) {
        return res.status(400).json({ success:false, message:"Cannot start a conversation with yourself" });
    }
    const contact = await prisma.user.findUnique({
        where:{
            id: targetUserId
        }
    })

    if(!contact){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }
    try{

        const hash = participantKey([req.user.id, targetUserId]);
        const conversation = await prisma.conversation.upsert({
            where:{
                participantHash: hash
            },
            update:{},
            create:{
                participantHash: hash,
                memberships: {
                    create: [
                        {
                            userId: req.user.id,
                            role: "member",
                        },
                        {
                            userId: targetUserId,
                            role: "member",
                        },
                    ]
                }
            }
        });


        return res.status(200).json({
            success: true,
            data: conversation
        });

    } catch (err){
        next(err);
    }
}

export async function updateLastSeenMessage(req, res, next){

    try {
            const io = getIO();
            const { messageId, conversationId } = matchedData(req);
            const membership = await prisma.membership.findUnique({
                where: {userId_conversationId: 
                            {userId: req.user.id, conversationId}
                        }
            });
        
            if(!membership){
                return res.status(404).json({
                    success: false,
                    message: "Membership not found"
                });
            }

            const message = await prisma.message.findFirst({
                where: {conversationId, id: messageId}
            });

            if(!message){
                return res.status(404).json({
                    success: false,
                    message: "Invalid message ID"
                });
            }

            let updatedMembership;
            if(membership.lastSeenMessageId  === null || messageId > membership.lastSeenMessageId){
                updatedMembership = await prisma.membership.update({
                    where: {userId_conversationId: 
                            {userId: req.user.id, conversationId}
                        },
                    data: {lastSeenMessageId: messageId},
                    select: {conversationId: true, userId: true, lastSeenMessageId: true}
                });
                
            }

            
            io.to(`conversation:${conversationId}`).emit("membership:updated", updatedMembership);
            console.log("Membership updated: ", updatedMembership);
        
            return res.status(200).json({
                success: true,
                data: { updatedMembership }
            })
        
    } catch (err) {
        next(err);    
    }
}

function participantKey(ids){
    const normalized = [...new Set(ids.map(Number))]
        .sort((a, b) => a -b);
    return normalized.join(":");
}
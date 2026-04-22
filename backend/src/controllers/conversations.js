import prisma from "../config/prisma.js";
import { matchedData } from "express-validator";


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
                participantHash: c.participantHash,
                updatedAt: c.updatedAt,
                lastMessage: c.messages[0] ?? null,
                participants: c.memberships
                .map((mm) => mm.user)
                .filter((u) => u.id !== req.user.id),
                myMembership: { role: m.role, lastSeenMessageId: m.lastSeenMessageId },
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
                            lastReadAt: new Date(),
                            role: "member",
                        },
                        {
                            userId: targetUserId,
                            lastReadAt: new Date(),
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

async function updateLastSeenMessage(req, res, next){

    try {
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

            let lastSeen = membership.lastSeenMessageId;
            if(membership.lastSeenMessageId  === null || messageId > membership.lastSeenMessageId){
                const updatedMembership = await prisma.membership.update({
                    where: {userId_conversationId: 
                            {userId: req.user.id, conversationId}
                        },
                    data: {lastSeenMessageId: messageId},
                    select: {lastSeenMessageId: true}
                });
                
                lastSeen = updatedMembership.lastSeenMessageId;
            }
        
            return res.status(200).json({
                success: true,
                data: { lastSeenMessageId: lastSeen }
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
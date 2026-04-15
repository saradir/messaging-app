import prisma from "../config/prisma.js";
import { matchedData } from "express-validator";
import { getIO } from "../config/socket.js"; 

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
                    include: {
                        memberships: {
                            include: { user: { select: { id: true, username: true } } }
                        }
                    }
                }
            }
        });



        message.conversation.memberships.forEach( m => {
            io.to(`user:${m.user.id}`).emit("message:new", message);
            console.log(`message sent to ${m.user.username}`)
        })
        return res.status(201).json({
            success: true,
            data: message
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

            orderBy: { createdAt: "asc" },
            take: limit
         })

         return res.status(200).json({
            success: true,
            data: messages
         });
    } catch(err){
        next(err);
    }  
}
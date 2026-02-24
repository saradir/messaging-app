import prisma from "../config/prisma.js";

export async function create(req, res, next){

    const conversationId = Number(req.params.conversationId);


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
                content: req.body.content,
                conversationId
            }
        });

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

    const conversationId = Number(req.params.conversationId);
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
            orderBy: { createdAt: "asc" }
         })

         return res.status(200).json({
            success: true,
            data: messages
         });
    } catch(err){
        next(err);
    }  
}
import { GoogleGenAI } from "@google/genai";
import { messageEvents } from "../utils/event-bus.js";
import { getIO } from "../config/socket.js";
import prisma from "../config/prisma.js";
import { formatMessage } from "../utils/payload-format.js";

const MODEL = "gemini-3.6-flash";
const BOT_USER_ID = 0;
const ai = new GoogleGenAI({});

const lastInteractionByConversationId = new Map();





async function  generateReply(input, previousInteractionId){
    const interaction = await ai.interactions.create({
        model: MODEL,
        input,
        previous_interaction_id: previousInteractionId ?? null,
        system_instruction: "You are a friendly chatbot inside a messaging app called Nettalker. Keep replies short and casual, like a text message."
    });

    return interaction;
}

async function createBotMessage(botMessage){
    try{
        const io = getIO();
        const message = await prisma.message.create({
            data:{
                authorId: BOT_USER_ID,
                content: botMessage.content,
                conversationId: botMessage.conversationId,
                clientId: botMessage.clientId
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
        message.conversation.memberships.forEach(m =>{
            io.to(`user:${m.user.id}`).emit("message:new", payload);
            console.log(`message sent to room: ${m.user.id}`);
        })
        return;
    }catch(err){
        console.error(err);
    }
}




messageEvents.on("message:new",  async (payload) =>{

    try {
        
            if(payload.authorId === BOT_USER_ID) return;
            if(!payload.memberIds.includes(BOT_USER_ID)) return;
        
            const previous = lastInteractionByConversationId.get(payload.conversationId);
            const reply = await generateReply(payload.content, previous);
            lastInteractionByConversationId.set(payload.conversationId, reply.id);
            const botMessage = {
                content: reply.output_text,
                authorId: BOT_USER_ID,
                clientId: crypto.randomUUID(),
                conversationId: payload.conversationId
            }
            createBotMessage(botMessage);
    } catch (error) {
        console.error(error);
    }
})
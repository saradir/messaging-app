import prisma from "../config/prisma.js";
import { matchedData } from "express-validator";

// Find user by email or username
export async function findUser(req, res, next){

    const  identifier  = matchedData(req).q;

    try{
        const user = await prisma.user.findFirst({
            where: {
                OR:[
                    {username: identifier},
                    {email: identifier}
                ]
                
            },
            select:{
                id: true,
                username: true,
                email: true,

            }
        });

        return res.status(200).json({
            success: true,
            data: [user]
        })

    } catch(err){
        next(err)
    }
}

export async function index(req, res, next){

    try {
        const contacts = await prisma.contact.findMany({
            where: {
                ownerId: Number(req.user.id)
            },
            select: {
                contact: {
                    select: {
                        username: true,
                        id: true,
                        email: true
                    }
                }
            }
        });
        const flattenedContacts = contacts?.map(c => c.contact) || null

        return res.status(200).json({
            success: true,
            data: flattenedContacts
        });
    
            
    } catch (err) {
        next(err);        
    }
}

export async function add(req, res, next){

    const { contactId } = matchedData(req);

    if(req.user.id === contactId){
        return res.status(400).json({
            success: false,
            message: "Can't add yourself"
        })
    }

    try{
        const contactUser = await prisma.user.findUnique({
            where: {
                id: contactId
            }
        })

        if(!contactUser){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const row = await prisma.contact.upsert({
            where: {
                ownerId_contactId: {
                ownerId: req.user.id,
                contactId,
                },
            },
            update: {},
            create: {
                ownerId: req.user.id,
                contactId,
            },
            include: {
                contact: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
                },
            },
        });

        return res.status(200).json({
            success: true,
            data: row.contact
        });
    } catch(err){
       return next(err);
    }
}

export async function remove(req, res, next){

    const { contactId } = matchedData(req);

    await prisma.contact.deleteMany({
            where: {
                ownerId: req.user.id,
                contactId: contactId
            }
        });

    return res.status(204).end();
}


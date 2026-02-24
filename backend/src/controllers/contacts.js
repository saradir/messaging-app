import prisma from "../config/prisma.js";


export async function addContact(req, res, next){

    const contactId = Number(req.body.contactId);

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

        const contact = await prisma.contact.create({
            data:{
                ownerId: req.user.id,
                contactId: contactId
                
            }
        })

        return res.status(200).json({
            success: true,
        });
    } catch(err){
        next(err)
    }

}
// Includes helpers to format payloads (messages, conversations, etc.)


// Returns a flattened conversation object
export const flattenConversation = (c, userId) => {
    return{
        id: c.id,
        updatedAt: c.updatedAt,
        lastMessage: c.messages[0] ?? null,
        partners: c.memberships
                .filter(mm => mm.user.id !== userId)
                .map(mm => mm.user),
        memberships: c.memberships
        .map((mm) => ({
            id: mm.user.id,
            username: mm.user.username,
            role: mm.role,
            lastSeenMessageId: mm.lastSeenMessageId, 
            })),                
    };
}

export const formatMessage = (message) => {
    return(
        {
            id: message.id,
            content: message.content,
            authorId: message.authorId,
            conversationId: message.conversationId,
            clientId: message.clientId,
            createdAt: message.createdAt
        }
    )
}
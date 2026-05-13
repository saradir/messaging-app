// Includes helpers to format payloads (messages, conversations, etc.)


// Returns a flattened conversation object
export const flattenConversation = (c, userId) => {
    const myMembership = c.memberships
                    .find(mm => mm.user.id === userId);
    return {
        id: c.id,
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
        myMembership: {
                        id: myMembership.user.id,
                        username: myMembership.user.username,
                        role: myMembership.role,
                        lastSeenMessageId: myMembership.lastSeenMessageId,
                        unreadCount: myMembership.unreadCount
        }
    };
}

export const formatMembership = (membership) => {

    return (
        {
            userId: membership.userId,
            conversationId: membership.conversation.id,
            lastMessage: membership.conversation.messages[0] ?? null,
            lastSeenMessageId: membership.lastSeenMessageId,
            participantMemberships: membership.conversation.memberships.map(mm => ({
                conversationId: mm.conversationId,
                userId: mm.user.id,
                username: mm.user.username,
                role: mm.role,
                lastSeenMessageId: mm.lastSeenMessageId,
            }
            ) )
        }
    )
}

export const formatConversation = (conversation) => {

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
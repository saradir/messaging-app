
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
import { create } from "zustand";


const sortConversations = (conversations) =>
  [...conversations].sort((a, b) => {
    const aTime = new Date(a.lastMessage?.createdAt ?? 0).getTime();
    const bTime = new Date(b.lastMessage?.createdAt ?? 0).getTime();
    return bTime - aTime;
  });


export const useChatStore = create((set, get) => ({
  conversations: null,
  contacts: null,
  messagesByConversation: {},
  membershipsByConversationUser: {},
  currentUserId: null,

// helper function to calculate undread count
  getUnreadCount: (conversationId) => {
      const state = get();
      const messages = state.messagesByConversation[conversationId] ?? [];
      const lastSeenMessageId =
      state.membershipsByConversationUser[conversationId]?.[state.currentUserId]?.lastSeenMessageId ?? 0;

      return messages.filter(
        m => m.authorId !== state.currentUserId && m.id > lastSeenMessageId
      ).length;
  },

  // Sets conversations array for sidebar and memberships map
  setConversations: (memberships) => {
        const myMemberships = memberships.map(mm => ({            
            conversationId: mm.conversationId,
            lastMessage: mm.lastMessage,
            lastSeenMessageId: mm.lastSeenMessageId,
            unreadCount: mm.unreadCount,
        }
        ));

        const participantMemberships = memberships.reduce((acc, mm) => {

            acc[mm.conversationId] = {};
            mm.participantMemberships.forEach(pm => {
            acc[mm.conversationId][pm.userId] = pm;
            });

            return acc;
        },{});

        set({conversations: myMemberships, membershipsByConversationUser: participantMemberships});

    },

    setMessages: (conversationId, messages) =>
        set((state) => ({
        messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: messages,
        },
    })),

  setCurrentUserId: (id) =>
    set(({currentUserId: id})),

  setContacts: (contacts) => set({ contacts }),

  addContact: (contact) =>
    set((state) => ({ contacts: [...(state.contacts ?? []), contact] })),

  removeContact: (contactId) =>
    set((state) => ({ contacts: state.contacts?.filter((c) => c.id !== contactId) ?? [] })),


    receiveMessage: (message) => {
    const { conversationId } = message;
    const state = get();

    // --- update messages ---
    const existing = state.messagesByConversation[conversationId] || [];

    const updatedMessages = [...existing.filter(m => m.clientId !== message.clientId), message]; // Dedupe local message

    // --- update conversations list ---
    const updatedConversations = state.conversations.map((c) =>
      c.conversationId === conversationId
        ? { ...c, lastMessage: message }
        : c
    );

    const sorted = sortConversations(updatedConversations);

    set({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: updatedMessages,
      },
      conversations: sorted,
    });
  },

    updateMessageStatus: (conversationId, messageClientId, status) => {
    const state = get();
    const existing = state.messagesByConversation[conversationId] || [];
    const message = existing.find(m => m.clientId === messageClientId);
    if(!message) return;

    const updated = {...message, status}
    get().receiveMessage(updated);

  },

    updateLastSeenMessage: (conversationId, userId, messageId) => {
      const state = get();
      const isCurrentUser = userId === state.currentUserId;

      const unreadCount = isCurrentUser
        ? state.messagesByConversation[conversationId]?.filter(
            m => m.authorId !== state.currentUserId && m.id > messageId
          ).length ?? 0
        : undefined;

      const conversations = isCurrentUser
        ? state.conversations.map(c =>
            c.conversationId === conversationId
              ? { ...c, lastSeenMessageId: messageId, unreadCount }
              : c
          )
        : state.conversations;

      set({
        membershipsByConversationUser: {
          ...state.membershipsByConversationUser,
          [conversationId]: {
            ...state.membershipsByConversationUser[conversationId],
            [userId]: {
              ...state.membershipsByConversationUser[conversationId]?.[userId],
              lastSeenMessageId: messageId,
              ...(isCurrentUser ? { unreadCount } : {}),
            },
          },
        },
        conversations,
    });
  },


    updateNewConversation: (conversation) => {
      const state = get();
      const existing = state.conversations ?? [];
      const updatedConversations = sortConversations([
        conversation,
        ...existing.filter(c => c.conversationId !== conversation.conversationId),
      ]);

      const newMemberships = conversation.participantMemberships.reduce((acc, m) => {
        acc[m.userId] = m;
        return acc;
      }, {});

      set({
        conversations: updatedConversations,
        membershipsByConversationUser: {
          ...state.membershipsByConversationUser,
          [conversation.conversationId]: newMemberships,
        },
      });
    },

}));


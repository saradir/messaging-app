import { create } from "zustand";


const sortConversations = (conversations) => {
  conversations.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || 0;
      const bTime = b.lastMessage?.createdAt || 0;
      return bTime - aTime;
    });
  return conversations;
}

export const useChatStore = create((set, get) => ({
  conversations: [],
  messagesByConversation: {},

  setConversations: (updater) =>
    set((state) => ({
      conversations:
        typeof updater === "function"
          ? updater(state.conversations)
          : updater,
    })),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: messages,
      },
    })),

  receiveMessage: (message) => {
    const { conversationId } = message;
    const state = get();

    // --- update messages ---
    const existing = state.messagesByConversation[conversationId] || [];

    const updatedMessages = [...existing.filter(m => m.clientId !== message.clientId), message]; // Dedupe local message

    // --- update conversations list ---
    const updatedConversations = state.conversations.map((c) =>
      c.id === conversationId
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

  updateLastSeenMessage: (conversationId, messageId) => {
    const state = get();
    const updated = state.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            myMembership: {
              ...c.myMembership,
              lastSeenMessageId: messageId,
            },
          }
        : c
    );
    set({ conversations: updated});
  }
}));
import { create } from "zustand";

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

    const updatedMessages = [...existing.filter(m => m.id !== message.id), message];

    // --- update conversations list ---
    const updatedConversations = state.conversations.map((c) =>
      c.id === conversationId
        ? { ...c, lastMessage: message }
        : c
    );

    const sorted = updatedConversations.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || 0;
      const bTime = b.lastMessage?.createdAt || 0;
      return bTime - aTime;
    });

    set({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: updatedMessages,
      },
      conversations: sorted,
    });
  },
}));
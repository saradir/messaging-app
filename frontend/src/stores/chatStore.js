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
  membershipsByConversation: {},
  currentUserId: 0,

  setConversations: (conversations) => {
    const membershipMap = conversations.reduce((convAcc, conversation) => {
    // For every conversation, build its member map
    const innerMemberMap = conversation.memberships.reduce((memAcc, m) => {
      memAcc[m.id] = m;
      return memAcc;
    }, {});
    // Assign that inner map to the conversation ID in our main accumulator
    convAcc[conversation.id] = innerMemberMap;
    return convAcc;
    }, {});

    set({conversations: conversations, membershipsByConversation: membershipMap});
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

    updateLastSeenMessage: (conversationId, userId, messageId) => 
      set((state) => ({
        membershipsByConversation: {
          ...state.membershipsByConversation,
          [conversationId]: {
            ...state.membershipsByConversation[conversationId],
            [userId]: {
              ...state.membershipsByConversation[conversationId]?.[userId],
              lastSeenMessageId: messageId
            }
          }
        }
      })),
  }));

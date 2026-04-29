import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchMessages, sendMessage, updateLastSeenMessage } from "../services/conversations.js"
import { MessageComposer } from "../components/MessageComposer.jsx";
import { MessagesContainer } from "../components/MessagesContainer.jsx";
import { ConversationHeader } from "../components/ConversationHeader.jsx";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../services/socket.js";
import "../styles/Conversation.css";
import { useChatStore } from "../stores/chatStore.js";

export function Conversation(){

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const { currentUser} = useContext(AuthContext);
    const conversationId = Number(useParams().conversationId);

    const messages = useChatStore((state) => state.messagesByConversation[conversationId]) || [];
    const setMessages = useChatStore((state) => state.setMessages);
    const receiveMessage = useChatStore((state) => state.receiveMessage);
    const updateMessageStatus = useChatStore((state) => state.updateMessageStatus);
    const updateLastSeenMessageToStore = useChatStore((state) => state.updateLastSeenMessage)
    const conversation = useChatStore(
        state => state.conversations.find(c => c.id === conversationId)
        );
    const memberships = useChatStore((state) => state.membershipsByConversation[conversationId]);
    const partnerMembership = conversation?.memberships.find(
        m => m.id !== currentUser.id
        );
    const committedLastSeenMessageId = memberships?.[currentUser.id]?.lastSeenMessageId;
    const lastSeenByPartnerId = memberships?.[partnerMembership?.id]?.lastSeenMessageId;
    const pendingSeenRef = useRef(committedLastSeenMessageId);
    const timeoutIdRef = useRef(null);

    // Handle when unseen message comes into view
    function handleMessageSeen(messageId){
        pendingSeenRef.current = messageId;
        // throttled updates to store
        if(timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = setTimeout(async () => {
            const latestMessageId = pendingSeenRef.current;
            try{
                await updateLastSeenMessage(conversationId, latestMessageId);
                updateLastSeenMessageToStore(conversationId, latestMessageId);
            } catch (error) {
                console.error("Failed to update seen message in server", error);
            }
        }, 1000);
    }
    
    async function handleSubmitMessage(content){

        const clientId = crypto.randomUUID();
        const message = {authorId: currentUser.id, conversationId, content, status: "pending", clientId }
        receiveMessage(message); // Update optimistically       
        try{
            await sendMessage(message);
        } catch (error) {
            console.error("Failed to send message:", error);
            // update failed status
            updateMessageStatus(conversationId, clientId, "failed");
        }
    }
    
    async function handleResendMessage(message){

        const { conversationId, clientId } = message
        updateMessageStatus(conversationId, clientId, "pending");

        try{
            await sendMessage(message);
        } catch (error){
                console.error(error);
                updateMessageStatus(conversationId, clientId, "failed");
            }
    }

    //---Load Messages---//
    useEffect(() => {
        if (!conversationId) return;
        async function loadMessages(){
            try {
                const messages = await fetchMessages(conversationId);
                setMessages(conversationId, messages);
            } catch (error) {
                setError("Failed to load messages");
                console.error(error);                
            } finally{
                setLoading(false);
                
            }
        }
        loadMessages();
    }, [conversationId, setMessages]);

    useEffect(() =>{
        socket.emit("conversation:join", conversationId);
        return () => {
            socket.emit('conversation:leave', conversationId); };
        
    })
    
    
    if(loading) return <p>Loading messages...</p>
    if(error) return <p>{error}</p>
    if (!conversation) return <p>Loading conversation...</p>;
    return(

        <div className="conversation-container">
            <ConversationHeader username={partnerMembership?.username} />
            <MessagesContainer key={conversationId} messages={messages} handleResendMessage={handleResendMessage} handleMessageSeen={handleMessageSeen} lastSeenMessageId={committedLastSeenMessageId} lastSeenByPartnerId={lastSeenByPartnerId} />
            <MessageComposer handleSubmit={handleSubmitMessage} />
        </div>
    )
}
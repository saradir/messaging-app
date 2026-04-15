import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchMessages, sendMessage } from "../services/conversations.js"
import { MessageComposer } from "../components/MessageComposer.jsx";
import { MessagesContainer } from "../components/MessagesContainer.jsx";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../services/socket.js";
import "../styles/Conversation.css";
import { useChatStore } from "../stores/chatStore.js";

export function Conversation(){

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const { currentUser} = useContext(AuthContext);

    const { conversationId } = useParams();
   const messages = useChatStore((state) => state.messagesByConversation[conversationId]) || [];
   const setMessages = useChatStore((state) => state.setMessages);
   const receiveMessage = useChatStore((state => state.receiveMessage));
   const updateMessageStatus = useChatStore((state => state.updateMessageStatus));

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

        const { conversationId, clientId, content } = message
        updateMessageStatus(conversationId, clientId, "pending");

        try{
            await sendMessage(message);
        } catch (error){
                console.error(error);
                updateMessageStatus(conversationId, clientId, "failed");
            }
    }

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
        socket.emit("conversation:join", conversationId);
        return () => {
            // emit leave later
        };
    }, [conversationId, setMessages]); 


    if(loading) return <p>Loading messages...</p>
    if(error) return <p>{error}</p>

    return(

        <div className="conversation-container">
            <MessagesContainer messages={messages} handleResendMessage={handleResendMessage} />
                 
            <MessageComposer handleSubmit={handleSubmitMessage} />
        </div>
    )
}
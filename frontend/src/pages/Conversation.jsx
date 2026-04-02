import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchMessages, sendMessage } from "../services/conversations.js"
import { MessageComposer } from "../components/MessageComposer.jsx";
import { MessagesContainer } from "../components/MessagesContainer.jsx";
import { AuthContext } from "../context/AuthContext";

import "../styles/Conversation.css";

export function Conversation(){

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null)
    const { currentUser} = useContext(AuthContext);

    const { conversationId } = useParams();

    async function handleSubmitMessage(content){

        const tempId = crypto.randomUUID();
        const tempMessage = {authorId: currentUser.id, content, status: "pending", id: tempId }
        setMessages(prev => [...prev, tempMessage]); // Update optimistically 
       
        try{
            const uploadedMessage = await sendMessage(conversationId, content);
            setMessages(prev =>
                prev.map(m =>
                    m.id === tempId
                    ? uploadedMessage
                    : m
                )
            ); 
        } catch (error) {

            console.error("Failed to send message:", error);
            // update failed status
            setMessages( prev => 
                prev.map( m =>
                    m.id === tempId
                    ? {...m, status: "failed"}
                    : m
                )
            );
        }

    }
    
    async function handleResendMessage(message){

        setMessages( prev =>
            prev.map( m => 
                m.id === message.id
                    ? { ...m, status: "pending"}
                    : m
            )
        );

        try{
            const uploadedMessage= await sendMessage(conversationId, message.content);
            setMessages(prev => [
                ...prev.filter(m => m.id !== message.id),
                uploadedMessage
                ]);
        } catch (error){
                console.error(error);
                setMessages( prev =>
                    prev.map( m => 
                        m.id === message.id
                        ? { ...m, status: "failed"}
                        : m
                    )
                );
            }
    }

    useEffect(() => {
        async function loadMessages(){
            try {
                const messages = await fetchMessages(conversationId);
                setMessages(messages);
            } catch (error) {
                setError("Failed to load messages");
                console.error(error);                
            } finally{
                setLoading(false);
            }
        }

        loadMessages();

    }, [conversationId]);


    if(loading) return <p>Loading messages...</p>
    if(error) return <p>{error}</p>

    return(

        <div className="conversation-container">
            <MessagesContainer messages={messages} handleResendMessage={handleResendMessage} />
                 
            <MessageComposer handleSubmit={handleSubmitMessage} />
        </div>
    )
}
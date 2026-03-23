import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMessages } from "../services/conversations.js"
import { MessageComposer } from "../components/MessageComposer.jsx";
import { MessagesContainer } from "../components/MessagesContainer.jsx";

export function Conversation(){

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null)

    const { conversationId } = useParams();

    async function handleSubmitMessage(content){

        if (sending) return;
        setSending(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_SERVER}/conversations/${conversationId}/messages`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content
                })
            });


            if(!response.ok){
               const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Failed: ${response.status}`);
            }

            const data = await response.json();
            const newMessage = data.data;

            setMessages(prev => [...prev, newMessage]);            
        } finally{
            setSending(false);
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
            
            
                
            <MessagesContainer messages={messages} />
                 
            <MessageComposer handleSubmit={handleSubmitMessage} />
        </div>
    )
}
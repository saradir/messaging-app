import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMessages } from "../services/conversations.js"

export function Conversation(){

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState(null);
    const [error, setError] = useState(null)

    const { conversationId } = useParams();

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
    console.log("Messages:", messages);

    return(
        <p>Messages Loaded</p>
    )
}
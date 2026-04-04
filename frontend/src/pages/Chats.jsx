import { useState, useEffect } from "react";
import ConversationList from "../components/ConversationList";
import "../styles/Chats.css";
import { fetchConversations } from "../services/conversations";

export default function Chats(){

   const [conversations, setConversations] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   useEffect(() => {
    async function loadConversations(){
        try {
            const conversations = await fetchConversations();
            setConversations(conversations);
        } catch (err) {
            setError("Failed to retrieve conversations");
            console.error("Error: ", err)           
        } finally{
            setLoading(false);
        }
    }
    loadConversations();
   }, []);



   if(loading) return <p>Loading...</p>
   if(error) return <p>{error}</p>

    return(
        <div className="main">
            <ConversationList conversations={ conversations }/>
        </div>
        
    )

}
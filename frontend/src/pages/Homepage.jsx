import { useState, useEffect } from "react";
import ConversationList from "../components/ConversationList";
import { Navbar } from "../components/Navbar";

import "../styles/Homepage.css";

export default function Homepage(){

   const [conversations, setConversations] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   useEffect(() => {
    async function fetchConversations(){
        try {
            const response = await fetch(`${import.meta.env.VITE_API_SERVER}/conversations`,{
                credentials: "include"
            });
    
            if(!response.ok){
                setError("Failed to retrieve conversations");
                console.error("Fetch failed: ", response.status)
                return;
            }

            const data = await response.json();
            setConversations(data.data)   
        } catch (err) {
            setError("Failed to retrieve conversations");
            console.error("Error: ", err)
            
        } finally{
            setLoading(false);
        }
    }

    fetchConversations();
   }, []);



   if(loading) return <p>Loading...</p>
   if(error) return <p>{error}</p>

    return(
        <div className="main">
            <Navbar/>
            <ConversationList conversations={ conversations }/>
        </div>
        
    )

}
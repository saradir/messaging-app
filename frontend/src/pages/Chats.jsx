import ConversationList from "../components/ConversationList";
import "../styles/Chats.css";

export default function Chats({conversations}){

   if(!conversations) return;

    return(
        <div className="main">
            <ConversationList conversations={ conversations }/>
        </div>
        
    )
}
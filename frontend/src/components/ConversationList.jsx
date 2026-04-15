import { ConversationRow } from "./ConversationRow";

import "../styles/ConversationList.css";
import { useChatStore } from "../stores/chatStore";



export function ConversationList(){
    const conversations = useChatStore((state) => state.conversations);
    
    if(!conversations || conversations.length === 0) return <div className="empty-state">No chats yet</div>
  
    return(

        <div className="conversation-list">
            { conversations.map( c => (
                < ConversationRow key={c.id} conversation={c} />
            ))}
        </div>     
    )
}

export default ConversationList;
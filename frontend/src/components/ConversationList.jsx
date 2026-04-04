import { ConversationRow } from "./ConversationRow";

import "../styles/ConversationList.css";


export function ConversationList({ conversations }){

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
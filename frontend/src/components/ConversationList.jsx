import { ConversationRow } from "./ConversationRow";

function ConversationList({ conversations }){

    if(!conversations || conversations.length === 0) return <p>No chats yet</p>
  
    return(

        <div className="conversation-list">
            { conversations.map( c => (
                < ConversationRow key={c.id} conversation={c} />
            ))}
        </div>     
    )
}

export default ConversationList;
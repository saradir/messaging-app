
function ConversationList({ conversations }){

    if(!conversations || conversations.length === 0) return <p>No chats yet</p>
  
    return(

        <div className="conversation-list">
            { conversations.map( c => (
                <div key={c.id} className="conversation" >
                    <div className="conversation-title">
                        
                    </div>

                    <div className="conversation-preview">
                        {c.lastMessage?.content || ""}
                    </div>
                </div>
            ))}
        </div>     
    )
}

export default ConversationList;
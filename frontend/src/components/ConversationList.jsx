
function ConversationList({ conversations }){

    if(!conversations || conversations.length === 0) return <p>No chats yet</p>

    return(

        <div className="conversation-list">
            { conversations.map( c => (
                <div key={c.id} className="conversation" id={c.id}>
                    <div className="conversation-title">
                        {c.participants}
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
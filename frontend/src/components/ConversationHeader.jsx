import "../styles/ConversationHeader.css"

export function ConversationHeader({username}){
    return(
        <div className="conversation-header">
            {username || ''}
        </div>
    )
}
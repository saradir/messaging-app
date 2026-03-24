import { useNavigate } from "react-router-dom"

import "../styles/ConversationRow.css";


export function ConversationRow({conversation}){
    const navigate = useNavigate();

    function handleClick(){
        navigate(`/conversations/${conversation.id}`);

    }
    return(
        <div className="conversation-row" onClick={handleClick} >
            <div className="conversation-title">
                {conversation.participants[0].username}
            </div>

            <div className="conversation-preview">
                {conversation.lastMessage?.content || ""}
            </div>
        </div>
    )
}
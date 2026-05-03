import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom";
import "../styles/ConversationRow.css";


export function ConversationRow({conversation}){
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const title = conversation.partners.map(p => p.username).join(", ");
    const isActive = String(conversation.id) === conversationId;

    function handleClick(){
        navigate(`/conversations/${conversation.id}`);

    }
    return(
        <div className={isActive ? "conversation-row active" : "conversation-row"} onClick={handleClick} >
            <div className="conversation-title">
                { title }     
            </div>

            <div className="conversation-preview">
                {conversation.lastMessage?.content || ""}
            </div>
        </div>
    )
}
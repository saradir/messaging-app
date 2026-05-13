import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom";
import "../styles/ConversationRow.css";
import { useChatStore } from "../stores/chatStore";

export function ConversationRow({conversation}){
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const currentUserId = useChatStore(state => state.currentUserId);
    const memberships = useChatStore((state) => state.membershipsByConversationUser?.[conversation.conversationId]) ?? {}
    const partnerMemberships = Object.values(memberships)
        .filter(m => m.userId !== currentUserId);

    const title = partnerMemberships.map(p => p.username).join(", ");


    const isUnread = conversation.lastMessage && conversation.lastMessage.authorId !==  currentUserId && conversation.lastSeenMessageId < conversation.lastMessage.id
    const isActive = String(conversation.conversationId) === conversationId;

    function handleClick(){
        navigate(`/conversations/${conversation.conversationId}`);

    }
    return(
        <div className={isActive ? "conversation-row active" : "conversation-row"} onClick={handleClick} >
            <div className="conversation-title">
                { title }     
            </div>

            <div className="unreadMarker">
                {isUnread ? "NEW" : ""}
            </div>
            
            <div className="conversation-preview">
                {conversation.lastMessage?.content || ""}
            </div>
        </div>
    )
}
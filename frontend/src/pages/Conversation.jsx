import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchMessages, sendMessage } from "../services/conversations.js"
import { MessageComposer } from "../components/MessageComposer.jsx";
import { MessagesContainer } from "../components/MessagesContainer.jsx";
import { ConversationHeader } from "../components/ConversationHeader.jsx";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../services/socket.js";
import "../styles/Conversation.css";
import { useChatStore } from "../stores/chatStore.js";

export function Conversation(){

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [showScrollButton, setShowScrollButton] = useState(false);
    const { currentUser} = useContext(AuthContext);
    const { conversationId } = useParams();
    const bottomRef = useRef(null);
    const hasLoaded = useRef(false);
    const containerRef = useRef(null);
    const nearBottomRef = useRef(true);

    const isNearBottom = () => {
        const container = containerRef.current;
        if(!container) return false;
        return (container.scrollHeight - container.scrollTop - container.clientHeight < 100);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const messages = useChatStore((state) => state.messagesByConversation[conversationId]) || [];
    const setMessages = useChatStore((state) => state.setMessages);
    const receiveMessage = useChatStore((state => state.receiveMessage));
    const updateMessageStatus = useChatStore((state => state.updateMessageStatus));
    const conversation = useChatStore(
        state => state.conversations.find(c => c.id === Number(conversationId))
        );
    const otherUser = conversation?.participants.find(
        p => p.id !== currentUser.id
        );

    const lastSeenMessageId = conversation?.myMembership.lastSeenMessageId;


    //---Observer---//
    const observerOptions = {root: containerRef.current, threshold: 1}
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e =>{
            if(e.isIntersecting){
                const messageId = e.target.dataset.id;
                console.log(messageId);
            }
        })
    }, observerOptions)



    function handleScroll(){
        nearBottomRef.current = isNearBottom();
        setShowScrollButton (!nearBottomRef.current);
     }
    
    async function handleSubmitMessage(content){

        const clientId = crypto.randomUUID();
        const message = {authorId: currentUser.id, conversationId, content, status: "pending", clientId }
        receiveMessage(message); // Update optimistically       
        try{
            await sendMessage(message);
        } catch (error) {
            console.error("Failed to send message:", error);
            // update failed status
            updateMessageStatus(conversationId, clientId, "failed");
        }
    }
    
    async function handleResendMessage(message){

        const { conversationId, clientId } = message
        updateMessageStatus(conversationId, clientId, "pending");

        try{
            await sendMessage(message);
        } catch (error){
                console.error(error);
                updateMessageStatus(conversationId, clientId, "failed");
            }
    }

    //---Load Messages---//
    useEffect(() => {
        if (!conversationId) return;
        async function loadMessages(){
            try {
                const messages = await fetchMessages(conversationId);
                setMessages(conversationId, messages);
            } catch (error) {
                setError("Failed to load messages");
                console.error(error);                
            } finally{
                setLoading(false);
                
            }
        }

        loadMessages();
        socket.emit("conversation:join", conversationId);
        return () => {
            // emit leave later
        };
    }, [conversationId, setMessages]);
    
    
    useEffect(() => {
        hasLoaded.current = false;
    }, [conversationId]);


    //---Scroll Behaviour---//
    useEffect(() => {
        if(!hasLoaded.current){
            bottomRef.current?.scrollIntoView({ behavior: "auto" });
            hasLoaded.current = true;
        }else{
            if(nearBottomRef.current){
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [messages]);


    if(loading) return <p>Loading messages...</p>
    if(error) return <p>{error}</p>

    return(

        <div className="conversation-container">
            <ConversationHeader username={otherUser.username} />
            <MessagesContainer messages={messages} handleResendMessage={handleResendMessage} bottomRef={bottomRef} containerRef={containerRef} onScroll={handleScroll} observer={observer} lastSeenMessageId={lastSeenMessageId} />
            <button
                className={`scroll-button ${showScrollButton ? "visible" : ""}`}
                onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
                >
                <svg viewBox="0 0 24 24">
                    <path
                    d="M12 5v12M6.5 11.5L12 17l5.5-5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                </svg>
            </button>
            <MessageComposer handleSubmit={handleSubmitMessage} />
        </div>
    )
}
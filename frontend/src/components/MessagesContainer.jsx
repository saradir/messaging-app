import { MessageBalloon } from "./MessageBalloon"
import {  Fragment, useEffect, useRef, useState } from "react";
import "../styles/MessagesContainer.css";

export function MessagesContainer({ messages, handleResendMessage, lastSeenMessageId, handleMessageSeen }) {
    const nearBottomRef = useRef(true);
    const hasLoaded = useRef(false);
    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const observerRef = useRef(null);
    const unseenNodesRef = useRef(new Map());
    const [showScrollButton, setShowScrollButton] = useState(false);
    
    const dividerIndexRef = useRef(
        messages.findIndex(m => m.id > lastSeenMessageId)
    );
    const setMessageNode = (messageId, node) =>{
        if(node){
            unseenNodesRef.current.set(messageId, node);
        }else{
            unseenNodesRef.current.delete(messageId);
        }
    }

    const isNearBottom = () => {
        const container = containerRef.current;
        if(!container) return false;
        return (container.scrollHeight - container.scrollTop - container.clientHeight < 100);
    }

    function handleScroll(){
        nearBottomRef.current = isNearBottom();
        setShowScrollButton (!nearBottomRef.current);
     }

    useEffect(() => {
        hasLoaded.current = false;
    }, []);


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

    //---Observer Setup---//    
    useEffect(() => {

        if(!containerRef.current) return;
        
        const observerOptions = {root: containerRef.current, threshold: 1}
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(e =>{
                if(e.isIntersecting){
                    const messageId = Number(e.target.dataset.id);
                    observerRef.current.unobserve(e.target);
                    if(messageId > lastSeenMessageId){ 
                        handleMessageSeen(messageId);
                    }
                }
            });
        }, observerOptions);

        return(() => {
            observerRef.current.disconnect();
        });
    }, [lastSeenMessageId, handleMessageSeen, containerRef]);


    useEffect(() => {
        if (!observerRef.current) return;

        unseenNodesRef.current.forEach((node, messageId) => {
            if (messageId > lastSeenMessageId) {
            observerRef.current.observe(node);
            } else {
            observerRef.current.unobserve(node);
            }
        });
    }, [messages, lastSeenMessageId]);


    if (!messages || messages.length === 0) {
        return (
        <div className="messages-container empty">
            No messages yet
            <div ref={bottomRef} />
        </div>
        );
    }

    return (
        <div className="messages-container" ref={containerRef} onScroll={handleScroll} >
            {messages.map((m, i) => {

                return(
                    <Fragment key={m.id}>
                        {i===dividerIndexRef && <div className="unseen-divider">Unseen Messages </div>}
                        <div className="observer-wrapper"
                            data-id={m.id}
                            ref={(node) => setMessageNode(m.id, node)}
                        >
                            <MessageBalloon message={m} onResend={handleResendMessage}/>
                        </div>
                    </Fragment>
                );
            })}

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
            <div ref={bottomRef} /> 
        </div>
    );
    }
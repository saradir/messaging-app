import { MessageBalloon } from "./MessageBalloon"
import {  Fragment, useEffect, useRef } from "react";
import "../styles/MessagesContainer.css";

export function MessagesContainer({ messages, handleResendMessage, bottomRef, onScroll, lastSeenMessageId, handleMessageSeen, containerRef }) {

    const observerRef = useRef(null);
    const unseenNodesRef = useRef(new Map());
    console.log("last seen: ", lastSeenMessageId);

    const setMessageNode = (messageId, node) =>{
        if(node){
            unseenNodesRef.current.set(messageId, node);
        }else{
            unseenNodesRef.current.delete(messageId);
        }
    }
    
    useEffect(() => {

        if(!containerRef.current) return;
        
        const observerOptions = {root: containerRef.current, threshold: 1}
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(e =>{
                if(e.isIntersecting){
                    const messageId = Number(e.target.dataset.id);
                    observerRef.current.unobserve(e.target);
                    console.log(messageId);
                    if(messageId > lastSeenMessageId){ 
                        console.log(messageId)
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
        <div className="messages-container" ref={containerRef} onScroll={onScroll} >
            {messages.map((m, i) => {

                const isUnread = m.id > lastSeenMessageId;
                const isFirstUnread = isUnread && (i === 0 || messages[i-1].id <= lastSeenMessageId);

                return(
                    <Fragment key={m.id}>
                        {isFirstUnread && <div className="unseen-divider">Unseen Messages </div>}
                        <div className="observer-wrapper"
                            data-id={m.id}
                            ref={(node) => setMessageNode(m.id, node)}
                        >
                            <MessageBalloon message={m} onResend={handleResendMessage}/>
                        </div>
                    </Fragment>
                );
            })}

            <div ref={bottomRef} /> 
        </div>
    );
    }
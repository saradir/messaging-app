import { MessageBalloon } from "./MessageBalloon"
import {  Fragment, useEffect, useRef, useState, useCallback } from "react";
import "../styles/MessagesContainer.css";
import { MessageObserver } from "./MessageObserver";

export function MessagesContainer({ messages, loading, handleResendMessage, lastSeenMessageId, handleMessageSeen, lastSeenByPartnerId }) {
    const nearBottomRef = useRef(true);  // used in ref to track whether user was in ref BEFORE message arrives
    const hasLoaded = useRef(false);
    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const dividerRef = useRef(null);
    const lastSeenRef = useRef(lastSeenMessageId);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Used for effects on first load only(e.g: new messages divider, instant scroll...)
    useEffect(() => {
        hasLoaded.current = false;
    }, []);

    //---Set up divider---//
    const [dividerIndex] = useState(() => {
        if (!messages.length || lastSeenMessageId == null) return null;

        const index = messages.findIndex(m => m.id > lastSeenMessageId);
        return index;
    });

    //---Scroll Behaviour---//
    const setDividerRef = useCallback((node) => {
        if (node && !hasLoaded.current) {
            // Instant jump to divider on mount
            node.scrollIntoView({ behavior: "auto" });
            hasLoaded.current = true;
            dividerRef.current = node; 
        }
    }, []);

    useEffect(() => {
        // SCENARIO A: Initial load, but NO divider exists
        if (!hasLoaded.current && dividerIndex === -1) {
            bottomRef.current?.scrollIntoView({ behavior: "auto" });
            hasLoaded.current = true;
            return;
        }

        // SCENARIO B: User is already viewing the chat and a new message arrives
        if (hasLoaded.current && nearBottomRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, dividerIndex]);

    const isNearBottom = () => {
        const container = containerRef.current;
        if(!container) return false;
        return (container.scrollHeight - container.scrollTop - container.clientHeight < 100);
    }

    function handleScroll(){
        nearBottomRef.current = isNearBottom();
        setShowScrollButton (!nearBottomRef.current);
     }



    if (!messages || messages.length === 0) {
        return (
        <div className="messages-container empty">
            {!loading && "No messages yet"}
            <div ref={bottomRef} />
        </div>
        );
    }

    return (
        <div className="messages-container" ref={containerRef} onScroll={handleScroll} >
            {messages.map((m, i) => {

                return(
                    <Fragment key={m.id}>
                        {i===dividerIndex && <div ref={setDividerRef} className="unseen-divider">Unseen Messages </div>}
                        <MessageObserver lastSeenMessageId={lastSeenRef} onResend={handleResendMessage} message={m} handleMessageSeen={handleMessageSeen} lastSeenByPartnerId={lastSeenByPartnerId} />                       
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
import { MessageBalloon } from "./MessageBalloon"
import {  Fragment, useEffect, useRef, useState } from "react";
import "../styles/MessagesContainer.css";

export function MessagesContainer({ messages, handleResendMessage, lastSeenMessageId, handleMessageSeen }) {
    const nearBottomRef = useRef(true);  // used in ref to track whether user was in ref BEFORE message arrives
    const hasLoaded = useRef(false);
    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const dividerRef = useRef(null);
    const observerRef = useRef(null);
    const unseenNodesRef = useRef(new Map());
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
    useEffect(() => {
        if (dividerIndex === null) return; // Assert divider index first
        // Instant scroll to bottom/divider on first load
        if(!hasLoaded.current){
            if(dividerRef.current){
                dividerRef.current.scrollIntoView({ behavior: "auto" });
            }else{
                bottomRef.current?.scrollIntoView({ behavior: "auto" });
            }
            hasLoaded.current = true;
        // Smooth scroll on new message if user is already near bottom
        }else{
            if(nearBottomRef.current){
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }
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

    const setMessageNode = (messageId, node) =>{
        if(node){
            unseenNodesRef.current.set(messageId, node);
        }else{
            unseenNodesRef.current.delete(messageId);
        }
    }


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
                        {i===dividerIndex && <div ref={dividerRef} className="unseen-divider">Unseen Messages </div>}
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
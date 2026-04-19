import { MessageBalloon } from "./MessageBalloon"
import "../styles/MessagesContainer.css";

export function MessagesContainer({ messages, handleResendMessage, bottomRef, containerRef, onScroll, observer, lastSeenMessageId }) {
    
    if (!messages || messages.length === 0) {
        return (<div className="messages-container empty">
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
                <>
                    {isFirstUnread && <div className="unseen-divider">Unseen Messages </div>}
                    <div className="observer-wrapper"
                        key={m.id}
                        data-id={m.id}
                        ref={(node) => {
                            if (node && m.id > lastSeenMessageId) {
                                observer.observe(node);
                            }
                        }}
                    >
                        <MessageBalloon message={m} onResend={handleResendMessage}/>
                    </div>
                </>
            );
        })}

        <div ref={bottomRef} /> 
    </div>
);
}
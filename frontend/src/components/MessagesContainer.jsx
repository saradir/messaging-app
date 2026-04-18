import { MessageBalloon } from "./MessageBalloon"
import "../styles/MessagesContainer.css";

export function MessagesContainer({ messages, handleResendMessage, bottomRef, containerRef, onScroll }) {
    
    if (!messages || messages.length === 0) {
        return (<div className="messages-container empty">
                    No messages yet
                    <div ref={bottomRef} />
                </div>
                );
    }

    return (
        <div className="messages-container" ref={containerRef} onScroll={onScroll} >
            {messages.map(m => (
                <MessageBalloon message={m} key={m.id} onResend={handleResendMessage}/>
            ))}

            <div ref={bottomRef} /> 
        </div>
    );
}
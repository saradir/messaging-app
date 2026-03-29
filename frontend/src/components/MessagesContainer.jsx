import { MessageBalloon } from "./MessageBalloon"
import "../styles/MessagesContainer.css";

export function MessagesContainer({ messages, handleResendMessage }) {
    if (!messages || messages.length === 0) {
        return <div className="messages-container empty">No messages yet</div>;
    }

    return (
        <div className="messages-container">
            {messages.map(m => (
                <MessageBalloon message={m} key={m.id} onResend={handleResendMessage}/>
            ))}
        </div>
    );
}
import { useInView } from "react-intersection-observer";
import { MessageBalloon } from "./MessageBalloon";


export function MessageObserver({message, lastSeenMessageId, handleMessageSeen, onResend, lastSeenByPartnerId }){
    const { ref: inViewRef, inView } = useInView({
        threshold: 1,
        triggerOnce: true,
        skip: message.id <= lastSeenMessageId.current,
        onChange: (inView) => {
            if (inView) handleMessageSeen(message.id);
        }
    });


    return (
        <div ref={inViewRef} data-id={message.id}>
            <MessageBalloon message={message} onResend={onResend} isRead={message.id <= lastSeenByPartnerId} />
        </div>
    );
}

    

import { useInView } from "react-intersection-observer";
import { MessageBalloon } from "./MessageBalloon";


export function MessageObserver({message, lastSeenMessageId, handleMessageSeen, onResend }){
    const { ref: inViewRef, inView } = useInView({
        threshold: 1,
        triggerOnce: true,
        skip: message.id <= lastSeenMessageId,
        onChange: (inView) => {
            if (inView) handleMessageSeen(message.id);
        }
    });


    return (
        <div ref={inViewRef} data-id={message.id}>
            <MessageBalloon message={message} onResend={onResend} />
        </div>
    );
}

    

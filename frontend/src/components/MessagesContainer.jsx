import { MessageBalloon } from "./MessageBalloon"

export function MessagesContainer({ messages }){

    if(!messages || messages.length === 0) return
    return(
        messages.map( m => (
            <MessageBalloon message={m} key={m.id} />
        ))
    )
}
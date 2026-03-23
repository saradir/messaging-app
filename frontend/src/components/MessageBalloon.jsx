import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function MessageBalloon({ message }){
    const { currentUser} = useContext(AuthContext);
    const belongsToCurrentUser = message.authorId === currentUser.id;

    return(
        <div className={`message-container ${belongsToCurrentUser? "right" : "left"}`}>
            <div className="message-content">
                {message.content}
            </div>
        </div>
    )
}
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { formatTime } from "../utils/general";
import "../styles/MessageBalloon.css"

export function MessageBalloon({ message, onResend, isRead }){
    const { currentUser} = useContext(AuthContext);
    const belongsToCurrentUser = message.authorId === currentUser.id;
    const timestamp = formatTime(message.createdAt);
    return(
        <div className={`message-container ${belongsToCurrentUser? "right" : "left"}`}>
            <div className="message-content">
                <span className="message-text">{message.content}</span>
                <div className="message-meta">            
                        <span className="message-timestamp">{timestamp}</span>
                        {belongsToCurrentUser &&
                    
                        <span className="message-status">
                            {message.status === "failed"
                                && <div><span className="failed-status">Delivery failed. Click to </span><button className="resend-button" onClick={() => onResend(message)}>resend</button></div>
                            }
                            {message.status === "pending"
                                && <div><span className="pending-status">Sending... </span></div>
                            }
                            {!message.status && isRead
                                && <div><span className="read-status"> ✓✓ </span></div>
                            }
                    
                            {!message.status && !isRead
                                && <div><span className="delivered-status"> ✓ </span></div>
                            }
                        </span>
                        }
                    </div>
                </div>
        </div>
    )
}
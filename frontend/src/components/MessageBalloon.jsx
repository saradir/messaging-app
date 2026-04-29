import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/MessageBalloon.css"

export function MessageBalloon({ message, onResend, isRead }){
    const { currentUser} = useContext(AuthContext);
    const belongsToCurrentUser = message.authorId === currentUser.id;

    return(
        <div className={`message-container ${belongsToCurrentUser? "right" : "left"}`}>
            <div className="message-content">
                <span className="message-text">{message.content}</span>
            

                {belongsToCurrentUser &&
                
                <div className="message-status">

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

                </div>
                }
            </div>
        </div>
    )
}
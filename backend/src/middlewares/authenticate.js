import sessions from "../tests/sessions.js";
import users from "../tests/users.js";

export function authenticateUser(req, res, next){
    const sessionId = req.cookies.sessionId;
    const session = sessions.find( s => (s.id === sessionId));

    if (!sessionId) {
        return res.status(401).json({ success: false });
    }

    if(!session) return res.status(401).json({
        success: false, 
        message: "Invalid request"
    });
    
    const user = users.find( u => u.id === session.userId);
    if(!user) return res.status(401).json({
        success: false, 
        message: "Invalid request"
    });


    req.user = user;
    return next();
}
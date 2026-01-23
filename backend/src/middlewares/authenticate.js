import sessions from "../tests/sessions";
import users from "../tests/users";

export function authenticateUser(req, res, next){
    console.log(req.cookies)
    const sessionId = req.cookies.sessionId;
    console.log("here")
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
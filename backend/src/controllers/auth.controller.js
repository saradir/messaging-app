import sessions from "../tests/sessions"; // TODO: replace sessions array with session store
import users from "../tests/users";


export function register(req, res, next){
    // presumably after verification and confirming uniqueness in a separate middleware
    const email = req.body.email // confirm unique
    const username = req.body.username; // confirm unique 
    const password = req.body.password; // TODO: hash password

    const id = crypto.randomUUID(); // leave to db later

    const user = {email, username, password, id}
    users.push(user);
    return res.status(201).json({
        success: true
    });
}

export function login(req, res, next){
    const user = users.find(u => u.email === req.body.email);

    if(!user) return res.status(401).json({
        success: false, message: "Invalid Credentials"
    });
    console.log("found user")

    const hashedpassword = user.password;
    if(req.body.password !== hashedpassword) return res.status(401).json({
        success: false, message: "Invalid Credentials"
    });

    console.log("confirmed password")
    const newSession = {id: crypto.randomUUID(), userId: user.id}
    sessions.push(newSession);
    console.log("created session");
    res.locals.currentuser = user;
    console.log("attached user")
    return res
    .cookie("sessionId", newSession.id,{
          httpOnly: true,
        sameSite: "lax",
        secure: false // true in production over HTTPS

    })
    .status(200)
    .json({success: true});
}

export function logout(req, res, next){
    return;
}

export function identify(req, res, next){
    // should also have req.user by now
    if(!req.user) return res.status(401);
    return res.status(200).json(req.user);
}
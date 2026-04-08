import session from "express-session";


export const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});
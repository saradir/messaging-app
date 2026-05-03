import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const PostgresStore = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PostgresStore({
    conString: process.env.DATABASE_URL, 
    tableName: 'Session',
    createTableIfMissing: true 
  }),
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production"? 'none' : 'lax'
  }
});
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const PostgresStore = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PostgresStore({
    conString: process.env.DATABASE_URL, 
    tableName: 'Session',
    createTableIfMissing: true // Nice helper so you don't have to manualy run SQL
  }),
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // Render uses a proxy for HTTPS, so we need one extra setting below
    secure: process.env.NODE_ENV === "production", 
    sameSite: 'lax' 
  }
});
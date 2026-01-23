
import 'dotenv/config';

const origins = (process.env.CORS_ORIGINS || "s")
                .split(",")
                .map(s => (s.trim()))
                .filter(s => s);
export const corsOptions = {
  origin: origins,
  optionsSuccessStatus: 200
};

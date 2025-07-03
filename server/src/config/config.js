import "dotenv/config";

const FRONTEND_URL = process.env.FRONTEND_URL;

const JWT = {
  SECRET: process.env.JWT_SECRET,
  LIFETIME: parseInt(process.env.JWT_LIFETIME),
};

const MONGO = {
  USER: process.env.DB_USER,
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE,
};

const NODE_ENV = process.env.NODE_ENV;

const SERVER = {
  PORT: process.env.PORT || 3000,
};

const SUPABASE = {
  URL: process.env.SUPABASE_URL,
  SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export { FRONTEND_URL, JWT, MONGO, NODE_ENV, SERVER, SUPABASE };

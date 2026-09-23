import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  sessionTokenSecret: process.env.SESSION_TOKEN_SECRET || 'dev-session-secret',
};

export default config;

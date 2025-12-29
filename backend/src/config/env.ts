import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set in .env file!');
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: (process.env.JWT_SECRET as string) || 'fallback-secret-change-this',
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN as string) || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl: (process.env.DATABASE_URL as string) || '',
};

// Validate required config
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required in .env file');
}
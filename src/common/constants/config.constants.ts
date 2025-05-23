export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.APP_URL || 'localhost:5001',
  DATABASE_URL: process.env.DATABASE_URL,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
} as const;

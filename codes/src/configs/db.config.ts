// db.config.ts
import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('db', () => ({
  url: process.env.DATABASE_URL, // 👈 matches .env
}));
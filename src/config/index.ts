import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN ?? '',
  clientId: process.env.CLIENT_ID ?? '',
  guildId: process.env.GUILD_ID ?? null,
  mongoUri: process.env.MONGO_URI ?? '',
} as const;

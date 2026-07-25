import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN ?? '',
  clientId: process.env.CLIENT_ID ?? '',
  guildId: process.env.GUILD_ID ?? null,
  mongoUri: process.env.MONGO_URI ?? '',
} as const;

if (!config.token) {
  throw new Error('Missing DISCORD_TOKEN in environment variables.');
}

if (!config.clientId) {
  throw new Error('Missing CLIENT_ID in environment variables.');
}

if (!config.mongoUri) {
  throw new Error('Missing MONGO_URI in environment variables.');
}

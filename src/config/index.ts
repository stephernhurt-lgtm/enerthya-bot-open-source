import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN ?? '',
  clientId: process.env.CLIENT_ID ?? '',
  guildId: process.env.GUILD_ID ?? (null as string | null),
  mongoUri: process.env.MONGO_URI ?? '',
  ownerId: process.env.OWNER_ID ?? (null as string | null),
  errorWebhook: process.env.ERROR_WEBHOOK ?? (null as string | null),
} as const;

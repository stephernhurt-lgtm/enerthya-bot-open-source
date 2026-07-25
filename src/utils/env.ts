import { z } from 'zod';

export const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(60, 'Token must be at least 60 characters'),
  CLIENT_ID: z.string().regex(/^\d{17,20}$/, 'Must be a 17-20 digit snowflake'),
  MONGO_URI: z
    .string()
    .startsWith('mongodb', { message: 'Must start with mongodb:// or mongodb+srv://' }),
  GUILD_ID: z
    .string()
    .regex(/^\d{17,20}$/, 'Must be a snowflake')
    .optional(),
});

export type EnvVars = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, string | undefined>): EnvVars {
  return envSchema.parse(raw);
}

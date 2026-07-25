import { Schema, model } from 'mongoose';

export interface IGuild {
  guildId: string;
  prefix: string;
  language: string;
  welcomeChannelId?: string;
  welcomeMessage?: string;
}

const guildSchema = new Schema<IGuild>(
  {
    guildId: { type: String, required: true, unique: true },
    prefix: { type: String, default: '/' },
    language: { type: String, default: 'en' },
    welcomeChannelId: { type: String, default: null },
    welcomeMessage: { type: String, default: null },
  },
  { timestamps: true },
);

export const Guild = model<IGuild>('Guild', guildSchema);

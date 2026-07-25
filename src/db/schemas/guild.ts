import { Schema, model } from 'mongoose';

export interface IGuild {
  guildId: string;
  prefix: string;
  language: string;
  welcomeChannelId?: string;
  welcomeMessage?: string;
  auditChannelId?: string;
  statsChannel_total?: string;
  statsChannel_online?: string;
  statsChannel_bots?: string;
  statsChannel_humans?: string;
}

const guildSchema = new Schema<IGuild>(
  {
    guildId: { type: String, required: true, unique: true },
    prefix: { type: String, default: '/' },
    language: { type: String, default: 'en' },
    welcomeChannelId: { type: String, default: null },
    welcomeMessage: { type: String, default: null },
    auditChannelId: { type: String, default: null },
    statsChannel_total: { type: String, default: null },
    statsChannel_online: { type: String, default: null },
    statsChannel_bots: { type: String, default: null },
    statsChannel_humans: { type: String, default: null },
  },
  { timestamps: true },
);

export const Guild = model<IGuild>('Guild', guildSchema);

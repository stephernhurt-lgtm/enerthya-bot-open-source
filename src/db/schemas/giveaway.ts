import { Schema, model } from 'mongoose';

export interface IGiveaway {
  _id: string;
  guildId: string;
  channelId: string;
  messageId: string;
  prize: string;
  winnerCount: number;
  endsAt: Date;
  hosterId: string;
  ended: boolean;
}

const giveawaySchema = new Schema<IGiveaway>(
  {
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true },
    prize: { type: String, required: true },
    winnerCount: { type: Number, default: 1 },
    endsAt: { type: Date, required: true },
    hosterId: { type: String, required: true },
    ended: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Giveaway = model<IGiveaway>('Giveaway', giveawaySchema);

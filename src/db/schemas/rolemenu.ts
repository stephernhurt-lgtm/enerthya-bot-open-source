import { Schema, model } from 'mongoose';

export interface IRoleMenu {
  guildId: string;
  channelId: string;
  messageId: string;
  roles: { emoji: string; roleId: string; label?: string }[];
}

const roleMenuSchema = new Schema<IRoleMenu>(
  {
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true },
    roles: [
      {
        emoji: { type: String, required: true },
        roleId: { type: String, required: true },
        label: { type: String, default: null },
      },
    ],
  },
  { timestamps: true },
);

export const RoleMenu = model<IRoleMenu>('RoleMenu', roleMenuSchema);

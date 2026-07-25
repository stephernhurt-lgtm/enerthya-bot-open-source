import { PermissionFlagsBits } from 'discord.js';

export const Perm = {
  // General
  Administrator: PermissionFlagsBits.Administrator,
  ManageGuild: PermissionFlagsBits.ManageGuild,
  ManageRoles: PermissionFlagsBits.ManageRoles,
  ManageChannels: PermissionFlagsBits.ManageChannels,
  ManageMessages: PermissionFlagsBits.ManageMessages,
  ManageWebhooks: PermissionFlagsBits.ManageWebhooks,
  ManageNicknames: PermissionFlagsBits.ManageNicknames,
  ManageEmojis: PermissionFlagsBits.ManageEmojisAndStickers,
  ManageEvents: PermissionFlagsBits.ManageEvents,
  ManageThreads: PermissionFlagsBits.ManageThreads,

  // Moderation
  KickMembers: PermissionFlagsBits.KickMembers,
  BanMembers: PermissionFlagsBits.BanMembers,
  ModerateMembers: PermissionFlagsBits.ModerateMembers,
  ViewAuditLog: PermissionFlagsBits.ViewAuditLog,

  // Messages
  SendMessages: PermissionFlagsBits.SendMessages,
  SendTTS: PermissionFlagsBits.SendTTSMessages,
  ReadMessages: PermissionFlagsBits.ReadMessageHistory,
  EmbedLinks: PermissionFlagsBits.EmbedLinks,
  AttachFiles: PermissionFlagsBits.AttachFiles,
  AddReactions: PermissionFlagsBits.AddReactions,
  MentionEveryone: PermissionFlagsBits.MentionEveryone,
  UseExternalEmoji: PermissionFlagsBits.UseExternalEmojis,

  // Voice
  Connect: PermissionFlagsBits.Connect,
  Speak: PermissionFlagsBits.Speak,
  MuteMembers: PermissionFlagsBits.MuteMembers,
  DeafenMembers: PermissionFlagsBits.DeafenMembers,
  MoveMembers: PermissionFlagsBits.MoveMembers,
  UseVAD: PermissionFlagsBits.UseVAD,
  PrioritySpeaker: PermissionFlagsBits.PrioritySpeaker,
  Stream: PermissionFlagsBits.Stream,

  // Threads
  CreatePublicThreads: PermissionFlagsBits.CreatePublicThreads,
  CreatePrivateThreads: PermissionFlagsBits.CreatePrivateThreads,
  SendInThreads: PermissionFlagsBits.SendMessagesInThreads,
} as const;

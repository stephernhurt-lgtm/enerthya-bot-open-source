export type AuditAction = 'ban' | 'kick' | 'clear' | 'config_update' | 'welcome_update';

export const auditColors: Record<AuditAction, number> = {
  ban: 0xed4245,
  kick: 0xfee75c,
  clear: 0x5865f2,
  config_update: 0x57f287,
  welcome_update: 0x57f287,
};

export const auditLabels: Record<AuditAction, string> = {
  ban: '🔨 Ban',
  kick: '👢 Kick',
  clear: '🧹 Clear Messages',
  config_update: '⚙️ Config Update',
  welcome_update: '👋 Welcome Update',
};

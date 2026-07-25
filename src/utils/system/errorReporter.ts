import { config } from '../../config/index.js';
import { Logger } from '../../core/Logger.js';

/** Send an error report to the configured Discord webhook. */
export async function reportError(context: string, error: Error): Promise<void> {
  if (!config.errorWebhook) return;

  const embed = {
    embeds: [
      {
        title: `🚨 ${context}`,
        color: 0xed4245,
        description: `\`\`\`${error.message.slice(0, 2000)}\`\`\``,
        fields: [
          {
            name: 'Stack',
            value: `\`\`\`${(error.stack ?? '').slice(0, 1000)}\`\`\``,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    await fetch(config.errorWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed),
    });
  } catch {
    Logger.warn('Failed to send error webhook.');
  }
}

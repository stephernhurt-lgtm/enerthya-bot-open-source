export function sanitize(text: string): string {
  return text.replace(/@/g, '@\u200b').replace(/[`*_~|]/g, '\\$&');
}

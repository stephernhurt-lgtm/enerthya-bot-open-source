import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks';

/* ─── Discord timestamps ─── */

/** Discord relative timestamp: `<t:1234567890:R>` */
export function relative(unix: number): string {
  return `<t:${unix}:R>`;
}

/** Discord short datetime: `<t:1234567890:f>` */
export function short(unix: number): string {
  return `<t:${unix}:f>`;
}

/** Discord long datetime: `<t:1234567890:F>` */
export function long(unix: number): string {
  return `<t:${unix}:F>`;
}

/** Helper: convert Date/ms to Discord timestamp string */
export function timestamp(
  date: Date | number,
  style: 'R' | 'f' | 'F' | 'd' | 'D' | 't' | 'T' = 'R',
): string {
  const unix =
    typeof date === 'number' ? Math.floor(date / 1000) : Math.floor(date.getTime() / 1000);
  return `<t:${unix}:${style}>`;
}

/* ─── Formatting ─── */

/** Format duration: "2h 30m" */
export function formatDuration(ms: number): string {
  const d = dayjs.duration(ms);
  const parts: string[] = [];
  if (d.days()) parts.push(`${d.days()}d`);
  if (d.hours()) parts.push(`${d.hours()}h`);
  if (d.minutes()) parts.push(`${d.minutes()}m`);
  if (d.seconds()) parts.push(`${d.seconds()}s`);
  return parts.join(' ') || '0s';
}

/** Human-readable "2 hours ago" */
export function fromNow(date: Date): string {
  return dayjs(date).fromNow();
}

/** Human-readable "in 2 hours" */
export function toNow(date: Date): string {
  return dayjs(date).toNow();
}

/* ─── Calculations ─── */

/** Add time to now and return Date */
export function addTime(amount: number, unit: TimeUnit): Date {
  return dayjs().add(amount, unit).toDate();
}

/** Check if a date is in the past */
export function isExpired(date: Date): boolean {
  return dayjs().isAfter(date);
}

/** Get remaining ms until a date */
export function remaining(date: Date): number {
  return Math.max(0, date.getTime() - Date.now());
}

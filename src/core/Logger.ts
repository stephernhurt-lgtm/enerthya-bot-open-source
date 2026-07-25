import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/* ─── Log Levels ─── */

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

/* ─── Colors ─── */

const colors: Record<LogLevel, string> = {
  debug: '\x1b[90m', // gray
  info: '\x1b[36m', // cyan
  warn: '\x1b[33m', // yellow
  error: '\x1b[31m', // red
};

const levelTags: Record<LogLevel, string> = {
  debug: 'DEBUG',
  info: ' INFO',
  warn: ' WARN',
  error: 'ERROR',
};

const reset = '\x1b[0m';
const bold = '\x1b[1m';

/* ─── File transport ─── */

let logDir = '';
let currentFile = '';

function ensureLogDir(): string {
  if (!logDir) {
    logDir = join(process.cwd(), 'logs');
    if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });
  }
  return logDir;
}

function getLogFile(): string {
  const date = new Date().toISOString().slice(0, 10);
  const expected = join(ensureLogDir(), `${date}.log`);
  if (expected !== currentFile) {
    currentFile = expected;
    appendFileSync(currentFile, '', 'utf-8'); // touch file
  }
  return currentFile;
}

/* ─── Shared helpers ─── */

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function formatLine(level: LogLevel, ...args: unknown[]): string {
  const msg = args
    .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 0) : String(a)))
    .join(' ');
  return `${timestamp()} [${levelTags[level]}] ${msg}`;
}

/* ─── Logging ─── */

function write(level: LogLevel, ...args: unknown[]): void {
  const line = formatLine(level, ...args);

  // Console output with color
  const prefix = `${colors[level]}${timestamp()} [${levelTags[level]}]${reset}`;
  const formatted = args
    .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 0) : String(a)))
    .join(' ');

  const method = level === 'error' ? console.error : console.log;
  method(prefix, formatted);

  // File output (plain text, no color)
  try {
    appendFileSync(getLogFile(), `${line}\n`, 'utf-8');
  } catch {
    // silently ignore file errors
  }
}

/* ─── Public API ─── */

export const Logger = {
  debug: (...args: unknown[]) => write('debug', ...args),
  info: (...args: unknown[]) => write('info', ...args),
  warn: (...args: unknown[]) => write('warn', ...args),
  error: (...args: unknown[]) => write('error', ...args),

  /** Green OK-level message */
  green: (...args: unknown[]) => {
    const line = formatLine('info', ...args);
    const prefix = `${'\x1b[38;5;40m'}${timestamp()} [  OK]${reset}`;
    const formatted = args
      .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
      .join(' ');
    console.log(prefix, formatted);
    try {
      appendFileSync(getLogFile(), `${line}\n`, 'utf-8');
    } catch {}
  },

  divider: () => {
    const line = '─'.repeat(60);
    console.log(line);
    try {
      appendFileSync(getLogFile(), `${line}\n`, 'utf-8');
    } catch {}
  },

  section: (title: string) => {
    Logger.divider();
    console.log(`${bold}${title}${reset}`);
    Logger.divider();
  },
};

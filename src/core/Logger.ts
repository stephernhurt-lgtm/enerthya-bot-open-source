import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const colors: Record<LogLevel, string> = {
  debug: '\x1b[90m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
};

const reset = '\x1b[0m';
const bold = '\x1b[1m';

const logDir = join(process.cwd(), 'logs');
if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function formatMsg(...args: unknown[]): string {
  return args
    .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 0) : String(a)))
    .join(' ');
}

function write(level: LogLevel, ...args: unknown[]): void {
  const msg = formatMsg(...args);
  const time = timestamp();
  const tag = level.toUpperCase().padEnd(5);
  const line = `${time} [${tag}] ${msg}`;

  // Console
  const method = level === 'error' ? console.error : console.log;
  method(`${colors[level]}${time} [${tag}]${reset} ${msg}`);

  // File — per level
  try {
    appendFileSync(join(logDir, `${level}.log`), `${line}\n`, 'utf-8');
    appendFileSync(join(logDir, 'combined.log'), `${line}\n`, 'utf-8');
  } catch {}
}

export const Logger = {
  debug: (...args: unknown[]) => write('debug', ...args),
  info: (...args: unknown[]) => write('info', ...args),
  warn: (...args: unknown[]) => write('warn', ...args),
  error: (...args: unknown[]) => write('error', ...args),

  green: (...args: unknown[]) => {
    const msg = formatMsg(...args);
    const time = timestamp();
    const line = `${time} [ OK ] ${msg}`;
    console.log(`${'\x1b[38;5;40m'}${time} [ OK ]${reset} ${msg}`);
    try {
      appendFileSync(join(logDir, 'info.log'), `${line}\n`, 'utf-8');
      appendFileSync(join(logDir, 'combined.log'), `${line}\n`, 'utf-8');
    } catch {}
  },

  divider: () => {
    const line = '─'.repeat(60);
    console.log(line);
    try {
      appendFileSync(join(logDir, 'info.log'), `${line}\n`, 'utf-8');
      appendFileSync(join(logDir, 'combined.log'), `${line}\n`, 'utf-8');
    } catch {}
  },

  section: (title: string) => {
    Logger.divider();
    console.log(`${bold}${title}${reset}`);
    Logger.divider();
  },
};

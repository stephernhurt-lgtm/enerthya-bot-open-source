type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const colors: Record<LogLevel, string> = {
  info: '\x1b[36m',    // cyan
  warn: '\x1b[33m',    // yellow
  error: '\x1b[31m',   // red
  debug: '\x1b[90m',   // gray
};

const reset = '\x1b[0m';
const bold = '\x1b[1m';

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

function log(level: LogLevel, ...args: unknown[]): void {
  const prefix = `${colors[level]}${timestamp()} [${level.toUpperCase()}]${reset}`;
  const method = level === 'error' ? console.error : console.log;
  method(prefix, ...args);
}

export const Logger = {
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
  debug: (...args: unknown[]) => log('debug', ...args),

  green: (...args: unknown[]) => {
    const msg = `\x1b[38;5;40m${timestamp()} [OK]${reset}`;
    console.log(msg, ...args);
  },

  divider: () => console.log('─'.repeat(60)),

  section: (title: string) => {
    Logger.divider();
    console.log(`${bold}${title}${reset}`);
    Logger.divider();
  },
};

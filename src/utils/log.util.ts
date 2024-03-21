import { Any } from "@/types/any.type";

import { formatDate } from "./date.util";

type LogLevel = "debug" | "info" | "warn" | "error";
const LogLevelOrder: { [key in LogLevel]: number } = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
};

export class Logger {
  private static defaultLogger = new Logger("");
  private logLevel: LogLevel = "info";
  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  private print(level: LogLevel, ...args: Any[]) {
    if (LogLevelOrder[level] < LogLevelOrder[this.logLevel]) {
      return;
    }
    console[level](
      formatDate(),
      `[${level.toUpperCase()}]`,
      `[${this.context}]`,
      ...args,
    );
  }

  info(...args: Any[]) {
    this.print("info", ...args);
  }

  static info(...args: Any[]) {
    this.defaultLogger.info(...args);
  }

  error(...args: Any[]) {
    this.print("error", ...args);
  }

  static error(...args: Any[]) {
    this.defaultLogger.error(...args);
  }

  warn(...args: Any[]) {
    this.print("warn", ...args);
  }

  static warn(...args: Any[]) {
    this.defaultLogger.warn(...args);
  }

  debug(...args: Any[]) {
    this.print("debug", ...args);
  }

  static debug(...args: Any[]) {
    this.defaultLogger.debug(...args);
  }
}

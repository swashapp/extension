import { Any } from "@/types/any.type";

import { formatDate } from "./date.util";

function print(level: "info" | "error" | "warn" | "debug", ...args: Any[]) {
  console[level](formatDate(), ...args);
}

export class Logger {
  static info(...args: Any[]) {
    print("info", ...args);
  }

  static error(...args: Any[]) {
    print("error", ...args);
  }

  static warn(...args: Any[]) {
    print("warn", ...args);
  }

  static debug(...args: Any[]) {
    print("debug", ...args);
  }
}

import { Any } from "@/types/any.type";

import { formatDate } from "./date.util";

function print(...args: Any[]) {
  console.info(formatDate(), ...args);
}

export class Logger {
  static info(...args: Any[]) {
    print(...args);
  }

  static error(...args: Any[]) {
    print(...args);
  }

  static warn(...args: Any[]) {
    print(...args);
  }

  static debug(...args: Any[]) {
    print(...args);
  }
}

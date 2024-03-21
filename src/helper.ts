import { runtime } from "webextension-polyfill";

import { Any } from "./types/any.type";
import { HelperMessage, Helpers } from "./types/app.type";

export async function sendMessage<T>(message: HelperMessage): Promise<T> {
  return (await runtime.sendMessage(message)) as T;
}

export function helper<T extends keyof Helpers>(obj: T): Helpers[T] {
  return new Proxy({} as Helpers[T], {
    get: (_, func: never) => {
      return async (...params: Any[]) => {
        const message: HelperMessage = {
          obj,
          func,
          params,
        };
        return sendMessage<Any>(message);
      };
    },
  });
}

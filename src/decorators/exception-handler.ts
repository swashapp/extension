import { BaseError } from "@/base-error";
import { SystemMessage } from "@/enums/message.enum";
import { Any } from "@/types/any.type";
import { Logger } from "@/utils/log.util";

export function ExceptionHandler(): ClassDecorator & MethodDecorator {
  return (
    target: Any,
    _propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    const handle = async (owner: Any, method: Any, ...args: Any[]) => {
      try {
        return await method.apply(owner, args);
      } catch (error) {
        if (error instanceof BaseError) throw error;
        Logger.error(error);
        throw new BaseError(SystemMessage.UNEXPECTED_THINGS_HAPPENED);
      }
    };

    if (descriptor) {
      const method = descriptor.value;
      descriptor.value = async function (...args: Any[]) {
        return handle(this, method, ...args);
      };
    } else {
      for (const key of Object.getOwnPropertyNames(target.prototype)) {
        const method = target.prototype[key];
        if (typeof method === "function" && key !== "constructor") {
          target.prototype[key] = async function (...args: Any[]) {
            return handle(this, method, ...args);
          };
        }
      }
    }
  };
}

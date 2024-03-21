import { useCallback, useState } from "react";

import { SystemMessage } from "@/enums/message.enum";
import { Any } from "@/types/any.type";
import { toastMessage } from "@/ui/components/toast/toast-message";

export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const safeRun = useCallback(
    async (
      func: () => Promise<Any>,
      on: {
        failure?: () => void | Promise<void>;
        finally?: () => void | Promise<void>;
      } = {},
    ) => {
      try {
        return await func();
      } catch (err: Any) {
        let message: string = SystemMessage.UNEXPECTED_THINGS_HAPPENED;
        if (err.message) message = err.message;

        toastMessage("error", message);
        if (on.failure) await on.failure();
      } finally {
        if (on.finally) await on.finally();
      }
    },
    [],
  );

  const resetError = () => setError(null);

  return { error, safeRun, resetError };
}

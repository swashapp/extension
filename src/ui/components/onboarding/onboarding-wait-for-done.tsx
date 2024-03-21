import { ReactNode, useCallback, useContext } from "react";

import { WaitForDone } from "@/ui/components/wait-for-done/wait-for-done";
import { OnboardingContext } from "@/ui/context/onboarding.context";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";

export function OnboardingWaitForDone({
  action,
  stepBack = 1,
}: {
  action: () => Promise<void>;
  stepBack?: number;
}): ReactNode {
  const { setRequestId, back, next } = useContext(OnboardingContext);
  const { safeRun } = useErrorHandler();

  const onLoad = useCallback(() => {
    safeRun(
      async () => {
        await action();
        next();
      },
      {
        failure: () => {
          back(stepBack);
        },
      },
    );
  }, [action, back, safeRun, next, stepBack]);

  const onBack = useCallback(() => {
    setRequestId("");
    back();
  }, [back, setRequestId]);

  return (
    <WaitForDone
      className={"round bg-white card32"}
      onLoad={onLoad}
      onBack={onBack}
    />
  );
}

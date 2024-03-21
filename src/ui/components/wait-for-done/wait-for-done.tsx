import clsx from "clsx";
import { ReactNode, useEffect } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { Button } from "@/ui/components/button/button";
import { WaitingProgressBar } from "@/ui/components/progress/waiting-progress";

import styles from "./wait-for-done.module.css";

export function WaitForDone({
  className = "",
  onBack,
  onLoad,
}: {
  className?: string;
  onBack: () => void;
  onLoad: () => void;
}): ReactNode {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <div className={"flex col gap40"}>
      <div className={className}>
        <div className={clsx("flex col justify-center", styles.container)}>
          <WaitingProgressBar />
        </div>
        <Button text={"Back"} color={ButtonColors.SECONDARY} onClick={onBack} />
      </div>
    </div>
  );
}

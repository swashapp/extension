import { ReactNode } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { Button } from "@/ui/components/button/button";

export function NavigationButtons({
  onBack,
  onNext,
  nextButtonText,
  loading,
  disableBack,
  disableNext,
}: {
  onBack: () => void;
  onNext: () => void;
  nextButtonText?: string;
  loading?: boolean;
  disableBack?: boolean;
  disableNext?: boolean;
}): ReactNode {
  return (
    <div className={"flex row align-center justify-between"}>
      <Button
        text={"Back"}
        color={ButtonColors.SECONDARY}
        disabled={disableBack}
        onClick={onBack}
      />
      <Button
        text={nextButtonText || "Next"}
        color={ButtonColors.PRIMARY}
        loading={loading}
        disabled={disableNext}
        onClick={onNext}
      />
    </div>
  );
}

import { ReactNode } from "react";

import { EndAdornment } from "@/ui/components/input/end-adornments/end-adornment";

export function NumericEndAdornment({
  onSpinUp,
  onSpinDown,
}: {
  onSpinUp: () => void;
  onSpinDown: () => void;
}): ReactNode {
  return (
    <EndAdornment>
      <div className={"flex col gap4"}>
        <img
          width={12}
          height={8}
          src={"/images/icons/triangle.svg"}
          alt={"+"}
          onClick={onSpinUp}
          className={"pointer"}
        />
        <img
          width={12}
          height={8}
          src={"/images/icons/triangle.svg"}
          alt={"-"}
          onClick={onSpinDown}
          className={"pointer rotate180"}
        />
      </div>
    </EndAdornment>
  );
}

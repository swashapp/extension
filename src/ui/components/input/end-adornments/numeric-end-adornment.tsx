import { ReactNode } from "react";

import { EndAdornment } from "@/ui/components/input/end-adornments/end-adornment";
import TriangleIcon from "~/images/icons/triangle.svg?react";

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
        <TriangleIcon
          width={12}
          height={8}
          onClick={onSpinUp}
          className={"pointer"}
        />
        <TriangleIcon
          width={12}
          height={8}
          onClick={onSpinDown}
          className={"pointer rotate180"}
        />
      </div>
    </EndAdornment>
  );
}

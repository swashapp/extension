import { ReactNode } from "react";

import { EndAdornment } from "@/ui/components/input/end-adornments/end-adornment";

export function ShowEndAdornment({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}): ReactNode {
  return (
    <EndAdornment>
      <img
        src={show ? "/images/icons/hide.svg" : "/images/icons/display.svg"}
        alt={"Change visibility"}
        className={"pointer"}
        onClick={onClick}
      />
    </EndAdornment>
  );
}

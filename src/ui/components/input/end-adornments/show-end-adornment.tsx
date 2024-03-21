import { ReactNode } from "react";

import { EndAdornment } from "@/ui/components/input/end-adornments/end-adornment";
import DisplayIcon from "~/images/icons/display.svg?react";
import HideIcon from "~/images/icons/hide.svg?react";

export function ShowEndAdornment({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}): ReactNode {
  return (
    <EndAdornment>
      {show ? (
        <HideIcon className={"pointer"} onClick={onClick} />
      ) : (
        <DisplayIcon className={"pointer"} onClick={onClick} />
      )}
    </EndAdornment>
  );
}

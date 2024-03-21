import { ReactNode } from "react";

import { EndAdornment } from "@/ui/components/input/end-adornments/end-adornment";

export function SearchEndAdornment(): ReactNode {
  return (
    <EndAdornment>
      <img
        src={"/images/icons/search.svg"}
        alt={"search"}
        className={"pointer"}
      />
    </EndAdornment>
  );
}
